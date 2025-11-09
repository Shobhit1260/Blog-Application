const express=require("express");
const router=express.Router();
const {createblog,getblogs,getblog,updateblog,deleteblog,likeblog,commentblog,getMyPosts}=require("../controllers/blogcontroller");
const protect=require("../middleware/auth")
const upload = require('../middleware/multer')


router.post('/createblog',protect, upload.single('coverImage'), createblog);
router.get('/getblogs',getblogs);
router.get('/getblog/:id',getblog);
router.get('/myposts',protect,getMyPosts);
router.put('/updateblog/:id',protect, upload.single('coverImage'), updateblog);
router.delete('/deleteblog/:id',protect,deleteblog);
router.post('/likeblog/:id',protect,likeblog);
router.post('/commentblog/:id',protect,commentblog);




module.exports=router;