var express=require('express');
var router=express.Router();

const { body, validationResult } = require('express-validator');


//importing signout from the controller to the route
const {signout,signup,signin,isSignedIn} =require("../controllers/auth");
//const {signup} =require("../controllers/auth");

/*const signout=(req,res)=>{
    //res.send("User Signout");

    //throwing json response
    res.json({
       message:"User Signout using json response"
    });

};*/

router.post("/signup",[
    body("name","name must be at least 3 chars long")
    .isLength({ min: 3 }),
    body("email","email is required")    
    .isEmail(),
    body("password", "password must be at least 5 chars long")
    .isLength({ min: 5 })
],
signup);

router.get("/signout",signout);

router.post("/signin",[
    body("email","email is required")    
    .isEmail(),
    body("password", "password field is required")
    .isLength({ min: 3 })
],
signin);

router.get("/testroute",isSignedIn,(req,res)=>{
    res.send("A protected route");
})


//throwing this router out
module.exports=router;