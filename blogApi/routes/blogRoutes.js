const express=require("express");
const router=express.Router();
const {createblog,getblogs,getblog,updateblog,deleteblog,likeblog,commentblog}=require("../controllers/blogcontroller");
const protect=require("../middleware/auth")


router.post('/createblog',protect,createblog);
router.get('/getblogs',getblogs);
router.get('/getblog/:id',getblog);
router.put('/updateblog/:id',protect,updateblog);
router.delete('/deleteblog/:id',protect,deleteblog);
router.post('/likeblog/:id',protect,likeblog);
router.post('/commentblog/:id',protect,commentblog);




module.exports=router;