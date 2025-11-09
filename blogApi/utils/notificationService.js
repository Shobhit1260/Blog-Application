const sendEmail = require('./emailSender');
const User = require('../models/userSchema');

// Send notification when someone likes a post
const sendLikeNotification = async (postAuthor, likerUsername, postTitle) => {
    try {
        // Check if user has email notifications enabled
        if (!postAuthor.settings?.notifications?.likeNotifications) {
            return;
        }

        const emailOptions = {
            to: postAuthor.email,
            subject: `${likerUsername} liked your post!`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #6366f1;">New Like on Your Post! 👍</h2>
                    <p>Hi ${postAuthor.username},</p>
                    <p><strong>${likerUsername}</strong> liked your post:</p>
                    <p style="background-color: #f3f4f6; padding: 15px; border-radius: 8px;">
                        <strong>"${postTitle}"</strong>
                    </p>
                    <p>Keep creating amazing content!</p>
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                    <p style="color: #6b7280; font-size: 12px;">
                        You can manage your notification preferences in your settings.
                    </p>
                </div>
            `
        };

        await sendEmail(emailOptions);
        console.log(`Like notification sent to ${postAuthor.email}`);
    } catch (error) {
        console.error('Error sending like notification:', error);
    }
};

// Send notification when someone comments on a post
const sendCommentNotification = async (postAuthor, commenterUsername, postTitle, commentText) => {
    try {
        // Check if user has comment notifications enabled
        if (!postAuthor.settings?.notifications?.commentNotifications) {
            return;
        }

        const emailOptions = {
            to: postAuthor.email,
            subject: `${commenterUsername} commented on your post`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #6366f1;">New Comment on Your Post! 💬</h2>
                    <p>Hi ${postAuthor.username},</p>
                    <p><strong>${commenterUsername}</strong> commented on your post:</p>
                    <p style="background-color: #f3f4f6; padding: 15px; border-radius: 8px;">
                        <strong>"${postTitle}"</strong>
                    </p>
                    <p style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin-top: 10px;">
                        "${commentText}"
                    </p>
                    <p>Reply to keep the conversation going!</p>
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                    <p style="color: #6b7280; font-size: 12px;">
                        You can manage your notification preferences in your settings.
                    </p>
                </div>
            `
        };

        await sendEmail(emailOptions);
        console.log(`Comment notification sent to ${postAuthor.email}`);
    } catch (error) {
        console.error('Error sending comment notification:', error);
    }
};

// Send notification when someone follows you
const sendFollowNotification = async (followedUser, followerUsername) => {
    try {
        // Check if user has follower notifications enabled
        if (!followedUser.settings?.notifications?.newFollowerNotifications) {
            return;
        }

        const emailOptions = {
            to: followedUser.email,
            subject: `${followerUsername} started following you!`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #6366f1;">New Follower! 🎉</h2>
                    <p>Hi ${followedUser.username},</p>
                    <p><strong>${followerUsername}</strong> started following you!</p>
                    <p>Your community is growing. Keep sharing great content!</p>
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                    <p style="color: #6b7280; font-size: 12px;">
                        You can manage your notification preferences in your settings.
                    </p>
                </div>
            `
        };

        await sendEmail(emailOptions);
        console.log(`Follow notification sent to ${followedUser.email}`);
    } catch (error) {
        console.error('Error sending follow notification:', error);
    }
};

// Send welcome email when user signs up
const sendWelcomeEmail = async (user) => {
    try {
        const emailOptions = {
            to: user.email,
            subject: 'Welcome to Our Blog Platform! 🎉',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #6366f1;">Welcome to Our Blog Platform! 🎉</h1>
                    <p>Hi ${user.username},</p>
                    <p>Thank you for joining our community! We're excited to have you here.</p>
                    <h3>Get Started:</h3>
                    <ul>
                        <li>Complete your profile</li>
                        <li>Write your first blog post</li>
                        <li>Follow other creators</li>
                        <li>Engage with the community</li>
                    </ul>
                    <p>If you have any questions, feel free to reach out to us.</p>
                    <p>Happy blogging!</p>
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                    <p style="color: #6b7280; font-size: 12px;">
                        The Blog Platform Team
                    </p>
                </div>
            `
        };

        await sendEmail(emailOptions);
        console.log(`Welcome email sent to ${user.email}`);
    } catch (error) {
        console.error('Error sending welcome email:', error);
    }
};

// Send weekly digest
const sendWeeklyDigest = async (user, weeklyStats) => {
    try {
        // Check if user has weekly digest enabled
        if (!user.settings?.notifications?.weeklyDigest) {
            return;
        }

        const emailOptions = {
            to: user.email,
            subject: 'Your Weekly Blog Stats 📊',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #6366f1;">Your Weekly Stats 📊</h2>
                    <p>Hi ${user.username},</p>
                    <p>Here's a summary of your blog activity this week:</p>
                    <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p><strong>New Posts:</strong> ${weeklyStats.newPosts || 0}</p>
                        <p><strong>Total Likes:</strong> ${weeklyStats.totalLikes || 0}</p>
                        <p><strong>Total Comments:</strong> ${weeklyStats.totalComments || 0}</p>
                        <p><strong>New Followers:</strong> ${weeklyStats.newFollowers || 0}</p>
                    </div>
                    <p>Keep up the great work!</p>
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                    <p style="color: #6b7280; font-size: 12px;">
                        You can manage your notification preferences in your settings.
                    </p>
                </div>
            `
        };

        await sendEmail(emailOptions);
        console.log(`Weekly digest sent to ${user.email}`);
    } catch (error) {
        console.error('Error sending weekly digest:', error);
    }
};

module.exports = {
    sendLikeNotification,
    sendCommentNotification,
    sendFollowNotification,
    sendWelcomeEmail,
    sendWeeklyDigest
};
