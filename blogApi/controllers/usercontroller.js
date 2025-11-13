const User=require('../models/userSchema');
const sendEmail = require('../utils/emailSender');
const  sendtoken = require('../utils/sendtoken');
const crypto = require('crypto');
const { sendWelcomeEmail, sendFollowNotification } = require('../utils/notificationService');
const { uploadStream } = require('../utils/cloudinary');

// Register User
exports.registerUser=async (req,res)=>{
    try{

        const {username,email,password,confirmpassword}=req.body;
        const userExists = await User.findOne({email});
        if(userExists){
            console.log("user exists with this email");
           return res.status(400).json({message:'Email already exists'}) 
        }
        if(password !== confirmpassword){
            return res.status(400).json({
                success:false,
            })} 
        const user= await User.create({
            username,
            email,
            password,
        })
      
        if(!user) return res.status(400).json({message:"User is not saved in database"})
        
        // Send welcome email (non-blocking)
        sendWelcomeEmail(user).catch(err => console.error('Failed to send welcome email:', err));
        
        sendtoken(200,user,res);

    }
    catch(error){
       console.error(error,"error while registering the user");
       res.status(500).json({
        success:false,
        message:"Internal server Error"
       })  
    }
}

// login User
exports.loginUser=async (req,res)=>{
    try{
        const {email,password}=req.body;

        if(!email || !password) return res.status(400).json({message:"email or password not valid"})

        const user= await User.findOne({email}).select('+password');

        if(!user)
           return res.status(400).json({message:"invalid email or user"})

        // @ts-ignore
        const isMatched=await user.comparePassword(password);

        if(!isMatched){
            return res.status(400).json({
                success:false,
                message:"Invalid passowrd"})
        }
        sendtoken(200,user,res);

    }
    catch(error){
       console.error(error);
       res.status(500).json({
        success:false,
        message:"Internal server Error"
       })
    }
}

exports.forgotpassword=async(req,res,next)=>{
    try{
        console.log("hi");
        const user=await User.findOne({email:req.body.email});
        if(!user)
            return res.status(404).json({success:false,message:"email not found."})
        const token=user.getResetToken();
        await user.save();
       
        
        // Frontend reset URL (update this to your frontend URL in production)
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const resetUrl = `${frontendUrl}/reset-password/${token}`;
        
        try{
        await sendEmail({
            to: user.email,
            subject: "Reset Password - Blogger",
            text: `Hi ${user.username},\n\nYou requested to reset your password.\n\nClick the link below to reset your password:\n\n${resetUrl}\n\nThis link will expire in 10 minutes.\n\nIf you did not request this, please ignore this email.\n\nBest regards,\nBlogger Team`,
        })
        res.status(200).json({
            success:true,
            message:"Email is successfully send."});
        }
        catch(error){
            user.resetPasswordToken=undefined;
            user.resetPasswordTokenexpire=undefined;
            await user.save();
            res.status(500).json("Email is not sent");
        }    
    }
    catch(error){
       console.error(error);
       res.status(500).json({message:"internal server error"}) 
    }
}

exports.resetPassword=async (req,res)=>{
    try{
    const {password,confirmPassword}=req.body;
    const resetPasswordToken= crypto.
                       createHash('sha256').
                       update(req.params.token).
                       digest('hex'); 
    const user=await User.findOne({
        resetPasswordToken,
        resetPasswordTokenexpire:{$gt:Date.now()}
    });  
   

    if(!user)
        return res.status(404).json({message:'user not found'});
    if(password !== confirmPassword){
        return  res.status(400).json({
            success:false,
            message:"passwords are not matching"
        })}
    user.password=req.body.password; 
    user.resetPasswordToken=undefined;
    user.resetPasswordTokenexpire=undefined; 
    await user.save();  
    sendtoken(201,user,res);
}
catch (error) {
    console.error(error);
    res.status(500).json({
        success: false,
        message: "Internal server error",
    });
}
         
}

exports.logout = async(req,res)=>{
    try{
      res.cookie('Token',null,{
        expires:new Date(Date.now()),
        httpOnly:true
      })
      res.status(200).json({
        success:true,
        message:'Logout successfully'
    });
    }
    catch(error){
        console.error(error);
        res.status(500).json({message:"internal Server error"})
    }
}

// Get User Details
exports.getUserDetails = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                bio: user.bio || '',
                avatar: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=6366f1&color=fff&size=200`,
                bgImage: user.bgImage || 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200',
                location: user.location || '',
                website: user.website || '',
                joinedDate: user.createdAt,
                postsCount: user.postsCount || 0,
                followersCount: user.followersCount || 0,
                followingCount: user.followingCount || 0
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

// Delete User Account
exports.deleteUserAccount = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Find user
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Optional: Delete all user's blogs
        const Blog = require('../models/blogSchema');
        await Blog.deleteMany({ author: userId });

        // Delete user account
        await User.findByIdAndDelete(userId);

        // Clear authentication cookie
        res.cookie('Token', null, {
            expires: new Date(Date.now()),
            httpOnly: true
        });

        res.status(200).json({
            success: true,
            message: 'Account deleted successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

// Update User Profile
exports.updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { username, email, bio, avatar, bgImage, location, website } = req.body;

        // If files uploaded (via multer memoryStorage)
        if (req.files) {
            // avatar
            if (req.files.avatar && req.files.avatar[0]) {
                try {
                    const file = req.files.avatar[0];
                    console.log('file',file);
                    const result = await uploadStream(file.buffer, 'avatar');
                    // overwrite avatar field with cloudinary url
                    console.log('Avatar uploaded to Cloudinary:', result);
                    req.body.avatar = result.secure_url;
                } catch (err) {
                    console.error('Avatar upload failed', err);
                }
            }
            // bgImage
            if (req.files.bgImage && req.files.bgImage[0]) {
                try {
                    const file = req.files.bgImage[0];
                    const result = await uploadStream(file.buffer, 'backgrounds');
                    req.body.bgImage = result.secure_url;
                } catch (err) {
                    console.error('Background upload failed', err);
                }
            }
        }

        // Check if email is being changed and if it's already in use
        if (email) {
            const existingUser = await User.findOne({ email, _id: { $ne: userId } });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already in use'
                });
            }
        }

    const updateData = {};
        if (username) updateData.username = username;
        if (email) updateData.email = email;
        if (bio !== undefined) updateData.bio = bio;
    if (req.body.avatar !== undefined) updateData.avatar = req.body.avatar;
    if (req.body.bgImage !== undefined) updateData.bgImage = req.body.bgImage;
        if (location !== undefined) updateData.location = location;
        if (website !== undefined) updateData.website = website;

        const user = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

// Change Password
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide current and new password'
            });
        }

        // Get user with password
        const user = await User.findById(userId).select('+password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if current password is correct
        const isMatched = await user.comparePassword(currentPassword);
        
        if (!isMatched) {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

// Update Notification Settings
exports.updateNotificationSettings = async (req, res) => {
    try {
        const userId = req.user.id;
        const { emailNotifications, commentNotifications, likeNotifications, newFollowerNotifications, weeklyDigest } = req.body;

        const updateData = {
            'settings.notifications.emailNotifications': emailNotifications,
            'settings.notifications.commentNotifications': commentNotifications,
            'settings.notifications.likeNotifications': likeNotifications,
            'settings.notifications.newFollowerNotifications': newFollowerNotifications,
            'settings.notifications.weeklyDigest': weeklyDigest
        };

        const user = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Notification settings updated successfully',
            settings: user.settings
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

// Update Privacy Settings
exports.updatePrivacySettings = async (req, res) => {
    try {
        const userId = req.user.id;
        const { profileVisibility, showEmail, allowComments, showReadingStats } = req.body;

        const updateData = {
            'settings.privacy.profileVisibility': profileVisibility,
            'settings.privacy.showEmail': showEmail,
            'settings.privacy.allowComments': allowComments,
            'settings.privacy.showReadingStats': showReadingStats
        };

        const user = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Privacy settings updated successfully',
            settings: user.settings
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

// Get User Settings
exports.getUserSettings = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('settings');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            settings: user.settings || {
                notifications: {
                    emailNotifications: true,
                    commentNotifications: true,
                    likeNotifications: true,
                    newFollowerNotifications: true,
                    weeklyDigest: true
                },
                privacy: {
                    profileVisibility: 'public',
                    showEmail: false,
                    allowComments: true,
                    showReadingStats: true
                }
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

// Get public profile by user id
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        // Check if current user is following this profile (from auth cookie)
        let isFollowing = false;
        const token = req.cookies?.Token;
        if (token) {
            try {
                const jwt = require('jsonwebtoken');
                const decoded = jwt.verify(token, process.env.SECRET_KEY);
                const currentUserId = decoded.id;
                isFollowing = user.followers && user.followers.some(id => id.toString() === currentUserId.toString());
            } catch (err) {
                // Token invalid or expired, ignore
            }
        }

        res.status(200).json({
            success: true,
            user: {
                _id: user._id,
                username: user.username,
                bio: user.bio || '',
                avatar: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=6366f1&color=fff&size=200`,
                bgImage: user.bgImage || 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200',
                location: user.location || '',
                website: user.website || '',
                joinedDate: user.createdAt,
                postsCount: user.postsCount || 0,
                followersCount: user.followersCount || 0,
                followingCount: user.followingCount || 0,
                isFollowing: isFollowing
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

// Follow a user
exports.followUser = async (req, res) => {
    try {
        const targetId = req.params.id;
        const currentUserId = req.user.id;

        if (targetId === currentUserId) return res.status(400).json({ success: false, message: "You can't follow yourself" });

        const targetUser = await User.findById(targetId);
        const currentUser = await User.findById(currentUserId);

        if (!targetUser || !currentUser) return res.status(404).json({ success: false, message: 'User not found' });

        // Already following?
        if (targetUser.followers && targetUser.followers.includes(currentUserId)) {
            return res.status(400).json({ success: false, message: 'Already following this user' });
        }

        // Add follower/following
        targetUser.followers = targetUser.followers || [];
        currentUser.following = currentUser.following || [];
        targetUser.followers.push(currentUserId);
        currentUser.following.push(targetId);

        // Update counts for convenience
        targetUser.followersCount = (targetUser.followers || []).length;
        currentUser.followingCount = (currentUser.following || []).length;

        await targetUser.save();
        await currentUser.save();

        // Send email notification to followed user (non-blocking)
        sendFollowNotification(targetUser, currentUser.username).catch(err => 
            console.error('Failed to send follow notification:', err)
        );

        res.status(200).json({ success: true, message: 'Followed successfully', followersCount: targetUser.followersCount, followingCount: currentUser.followingCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

// Unfollow a user
exports.unfollowUser = async (req, res) => {
    try {
        const targetId = req.params.id;
        const currentUserId = req.user.id;

        if (targetId === currentUserId) return res.status(400).json({ success: false, message: "You can't unfollow yourself" });

        const targetUser = await User.findById(targetId);
        const currentUser = await User.findById(currentUserId);

        if (!targetUser || !currentUser) return res.status(404).json({ success: false, message: 'User not found' });

        targetUser.followers = (targetUser.followers || []).filter(id => id.toString() !== currentUserId.toString());
        currentUser.following = (currentUser.following || []).filter(id => id.toString() !== targetId.toString());

        targetUser.followersCount = (targetUser.followers || []).length;
        currentUser.followingCount = (currentUser.following || []).length;

        await targetUser.save();
        await currentUser.save();

        res.status(200).json({ success: true, message: 'Unfollowed successfully', followersCount: targetUser.followersCount, followingCount: currentUser.followingCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}
