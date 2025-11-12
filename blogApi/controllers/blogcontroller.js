const Blog=require("../models/blogSchema");
const User=require("../models/userSchema");
const { sendLikeNotification, sendCommentNotification } = require('../utils/notificationService');
const { uploadStream } = require('../utils/cloudinary');
// create a blog post 
exports.createblog=async(req,res)=>{
    try{
       let {title,content,published,coverImage,categories,tags}=req.body;
       
       // Parse JSON strings from FormData for arrays
       if (typeof categories === 'string') {
           try {
               categories = JSON.parse(categories);
           } catch (e) {
               categories = [];
           }
       }
       if (typeof tags === 'string') {
           try {
               tags = JSON.parse(tags);
           } catch (e) {
               tags = [];
           }
       }
       
       // If a file was uploaded via multer (single 'coverImage') then upload to Cloudinary
       if (req.file && req.file.buffer) {
           try {
               const result = await uploadStream(req.file.buffer, 'covers');
               // override coverImage with uploaded URL
               coverImage = result.secure_url;
           } catch (err) {
               console.error('Cover upload failed', err);
           }
       }
       
       if(!title || !content) return res.status(400).json({
        success:false,
        message:"title or content is missing."
       })
       
       const blog=await Blog.create({
        title,
        content,
        author:req.user._id,
        coverImage: coverImage,
        published: published === 'true' || published === true,
        categories: categories || [],
        tags: tags || []
       })
       
        res.status(201).json({
            success:true,
            message:"blog successfully created.",
            blog
        })

    }
    catch(error){
        console.error(error);
        res.status(500).json({message:"internal server error"});
    }
}

// get all blogs (only published posts for discover/home)
exports.getblogs=async(req,res)=>{
     try{
        // Only return published blogs for public discover feed
        const blogs=await Blog.find({ published: true }).populate("author","username email");
        // return empty array when no blogs found
        res.status(200).json({
            success:true,
            blogs,
            message: "blogs are found" 
        })
     }
     catch(error){
        console.error(error);
        res.status(500).json({message:"internal server error"});
    }
}

// get a single blog
exports.getblog=async(req,res)=>{
    try{
        
         const parameterId = req.params.id;  
         const blog = await Blog.findById(req.params.id)
             .populate('author', 'username email')
             .populate({ path: 'comments.user', select: 'username avatar' });
         if (!blog) return res.status(404).json({ message: 'blog not found.' });
                // Build nested comment tree from flat comments array
                try {
                    const commentsFlat = blog.comments.map(c => ({ ...c.toObject(), children: [] }));
                    /**
                     * Use an object with string keys for easier lookup.
                     * Explicitly declare as Object to satisfy linters.
                     */
                    const map = Object.create(null);
                    commentsFlat.forEach(c => { map[c._id.toString()] = c; });
                    const nested = [];
                    commentsFlat.forEach(c => {
                        if (c.parentId) {
                            const pid = c.parentId.toString();
                            if (map[pid]) map[pid].children.push(c);
                            else nested.push(c);
                        } else {
                            nested.push(c);
                        }
                    });

                    const blogObj = blog.toObject();
                    blogObj.comments = nested;
                    return res.status(200).json({ success: true, blog: blogObj, message: 'blog is found' });
                } catch (err) {
                    console.error('Error building nested comments', err);
                    return res.status(200).json({ success: true, blog, message: 'blog is found' });
                }
    }
    catch(error){
        console.error(error);
        res.status(500).json({message:"internal server error"});
    }
}

// update a blog post
exports.updateblog=async(req,res)=>{
    try{
    const blog= await Blog.findById(req.params.id);
    if(!blog || blog.author.toString() !== req.user._id.toString()) return res.status(400).json({message:"blog not found or unauthorized."});
    
    blog.title=req.body.title||blog.title;
    blog.content=req.body.content||blog.content;
    blog.published= req.body.published === 'true' || req.body.published === true ? true : blog.published;
    
    // Parse JSON strings from FormData for arrays
    if (req.body.tags) {
        if (typeof req.body.tags === 'string') {
            try {
                blog.tags = JSON.parse(req.body.tags);
            } catch (e) {
                blog.tags = req.body.tags;
            }
        } else {
            blog.tags = req.body.tags;
        }
    }
    
    if (req.body.categories) {
        if (typeof req.body.categories === 'string') {
            try {
                blog.categories = JSON.parse(req.body.categories);
            } catch (e) {
                blog.categories = req.body.categories;
            }
        } else {
            blog.categories = req.body.categories;
        }
    }
    
    // If a new cover image file was uploaded via multer, upload to Cloudinary
    if (req.file && req.file.buffer) {
        try {
            const result = await uploadStream(req.file.buffer, 'covers');
            blog.coverImage = result.secure_url;
        } catch (err) {
            console.error('Cover upload failed', err);
            // fallback to body field if provided
            blog.coverImage = req.body.coverImage || blog.coverImage;
        }
    } else {
        blog.coverImage = req.body.coverImage || blog.coverImage;
    }
    
    await blog.save();
    res.status(200).json({blog,message:"blog updated."})
    }
    catch(error){
        console.error(error);
        res.status(500).json({message:"internal server error"});
    }  
}

// delete a blog post
exports.deleteblog=async(req,res)=>{
    try{
        const blog= await Blog.findById(req.params.id);
        if(!blog || blog.author.toString() !== req.user._id.toString()) return res.status(400).json({message:"blog not found or unauthorized."});
        await blog.deleteOne();
        res.status(200).json({message:"blog deleted."})
        }
    catch(error){
            console.error(error);
            res.status(500).json({message:"internal server error"});
        }
}

// like/unlike toggle a blog post
exports.likeblog=async(req,res)=>{
     try{
                 const blog = await Blog.findById(req.params.id).populate('author');
         if(!blog) return res.status(404).json({message:"blog not found."});
         
         const userIndex = blog.likes.indexOf(req.user._id);
         let isLiked = false;
         
         if(userIndex === -1){
            // User hasn't liked yet, add like
            blog.likes.push(req.user._id);
            isLiked = true;
            await blog.save();
            
            // Send email notification to post author (if not liking own post)
            if(blog.author._id.toString() !== req.user._id.toString()){
                const liker = await User.findById(req.user._id);
                if (liker) await sendLikeNotification(blog.author, liker.username, blog.title);
            }
         } else {
            // User has already liked, remove like (unlike)
            blog.likes.splice(userIndex, 1);
            isLiked = false;
            await blog.save();
         }
         
                 // return populated blog including comments.user
                 const updated = await Blog.findById(req.params.id)
                     .populate('author', 'username email')
                     .populate({ path: 'comments.user', select: 'username avatar' });
                 res.status(200).json({ blog: updated, isLiked, message: isLiked ? "blog is liked." : "blog is unliked." }) 
     }
     catch(error){
         console.error(error);
         res.status(500).json({message:"internal server error"});

     }
}

// add a comment 
exports.commentblog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('author');
        if (!blog) return res.status(404).json({ message: 'blog not found.' });

    // Allow optional parentId for replies and optional emoji
    const parentId = req.body.parentId || null;
    const emoji = req.body.emoji || '';
    blog.comments.push({ user: req.user._id, comment: req.body.comment, emoji, parentId });
        await blog.save();

        // Send email notification to post author (if not commenting on own post)
        if (blog.author._id.toString() !== req.user._id.toString()) {
            const commenter = await User.findById(req.user._id);
            if (commenter) {
                await sendCommentNotification(blog.author, commenter.username, blog.title, req.body.comment);
            }
        }

        // Return populated blog including commenter info
                const updated = await Blog.findById(req.params.id)
                        .populate('author', 'username email')
                        .populate({ path: 'comments.user', select: 'username avatar' });

                // Build nested comments for response
                try {
                    const commentsFlat = updated.comments.map(c => ({ ...c.toObject(), children: [] }));
                    const map = Object.create(null);
                    commentsFlat.forEach(c => { map[c._id.toString()] = c; });
                    const nested = [];
                    commentsFlat.forEach(c => {
                        if (c.parentId) {
                            const pid = c.parentId.toString();
                            if (map[pid]) map[pid].children.push(c);
                            else nested.push(c);
                        } else {
                            nested.push(c);
                        }
                    });

                    const blogObj = updated.toObject();
                    blogObj.comments = nested;
                    res.status(200).json({ blog: blogObj, message: 'comment is pushed.' });
                } catch (err) {
                    console.error('Error building nested comments', err);
                    res.status(200).json({ blog: updated, message: 'comment is pushed.' });
                }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'internal server error' });
    }
}

// get current user's posts
exports.getMyPosts = async (req, res) => {
    try {
        // Get all posts where author is the current logged-in user
        const blogs = await Blog.find({ author: req.user._id })
            .populate("author", "username email")
            .sort({ createdAt: -1 }); // Sort by newest first
        
        res.status(200).json({
            success: true,
            blogs,
            message: "Your posts retrieved successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}