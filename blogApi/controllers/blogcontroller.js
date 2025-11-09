const Blog=require("../models/blogSchema")
// create a blog post 
exports.createblog=async(req,res)=>{
    try{
       const {title,content}=req.body;
       if(!title || !content) return res.status(400).json({
        success:false,
        message:"title or content is missing."
       })
       const blog=await Blog.create({
        title,content,author:req.user._id
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

// get all blogs
exports.getblogs=async(req,res)=>{
     try{
        const blogs=await Blog.find().populate("author","username email");
        // return empty array when no blogs found
        res.status(200).json({
            success:true,
            blogs,
            message: blogs.length ? "blogs are found" : "no blogs found"
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
     const blog=await Blog.findById(req.params.id).populate("author","username email");
     if(!blog)
        return res.status(404).json({message:"blog not found."});
    res.status(200).json({
        success:true,
        blog,
        message:"blog is found"})
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

// like a blog post
exports.likeblog=async(req,res)=>{
     try{
         const blog=await Blog.findById(req.params.id);
         if(!blog) return res.status(404).json({message:"blog not found."});  
         if(!blog.likes.includes(req.user._id)){
            blog.likes.push(req.user._id);
            await blog.save();
         }
         res.status(200).json({blog,message:"blog is liked."}) 
     }
     catch(error){
         console.error(error);
         res.status(500).json({message:"internal server error"});

     }
}

// add a comment 
exports.commentblog=async(req,res)=>{
    try{
         const blog=await Blog.findById(req.params.id);
       if(!blog) return res.status(404).json({message:"blog not found."});  
       
        blog.comments.push({user:req.user._id,comment:req.body.comment});
        await blog.save();
       
         res.status(200).json({blog,message:"comment is pushed."}) 
    }
    catch(error){
        console.error(error);
        res.status(500).json({message:"internal server error"});
    }
}