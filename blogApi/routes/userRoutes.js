const express=require("express");
const router=express.Router();
const {
    registerUser,
    loginUser,
    forgotpassword,
    resetPassword,
    logout,
    getUserDetails,
    deleteUserAccount,
    updateUserProfile,
    changePassword,
    updateNotificationSettings,
    updatePrivacySettings,
    getUserSettings
}=require('../controllers/usercontroller')
const protect = require('../middleware/auth');

// Add profile & follow controllers
const { getUserById, followUser, unfollowUser } = require('../controllers/usercontroller');
const upload = require('../middleware/multer')

router.post('/register',registerUser);
router.post('/login',loginUser);
router.post('/forgotpassword',forgotpassword);
router.put('/password/reset/:token',resetPassword);
router.get('/logout',logout);

// Protected routes (require authentication)
router.get('/me', protect, getUserDetails);
router.put('/updateprofile', protect, upload.fields([{ name: 'avatar' }, { name: 'bgImage' }]), updateUserProfile);
router.delete('/deleteaccount', protect, deleteUserAccount);
router.put('/changepassword', protect, changePassword);
router.get('/settings', protect, getUserSettings);
router.put('/settings/notifications', protect, updateNotificationSettings);
router.put('/settings/privacy', protect, updatePrivacySettings);
// Follow/unfollow & public profile
router.post('/follow/:id', protect, followUser);
router.post('/unfollow/:id', protect, unfollowUser);
router.get('/:id', getUserById);


module.exports=router;