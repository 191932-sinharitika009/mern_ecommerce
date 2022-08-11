//give the controller name same as route name 
const User=require("../models/user")
const { body, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

//signup
exports.signup=(req,res)=>{
    //console.log("Signup works");
    // res.json({
    //     message:"Signup route works!"
    // })

    // console.log("REQ BODY",req.body);

    //validating results with error message 
    const errors=validationResult(req)

    if(!errors.isEmpty()){
        return res.status(422).json({
            error : errors.array()[0].msg  //js property to convert in array
        });
    }


     //saving a user to DB
     const user = new User(req.body)
     user.save((err,user)=>{
         if(err){
             return res.status(400).json({
                 err:"Not able to save user in db"
             })
         }
         //res.json(user);
         res.json({
             name:user.name,
             email:user.email,
             id:user._id
         })
     })
};

//signin
exports.signin=(req,res)=>{
    const errors=validationResult(req);
    //destructing of data
    const {email,password} = req.body;

    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()[0].msg  //js property to convert in array
        });
    }

    User.findOne({email},(err,user)=>{
        if(err || !user){
            return res.status(400).json({
                error:"User email does not exist"
            })
        }

        //to check whether password matches or not
        if(!user.authenticate(password)){
           return res.status(401).json({
               error:"Email and password do not match"
           }) 
        }
        //if everything is great till now ...signin the user

        //create token
        const token=jwt.sign({_id:user._id},process.env.SECRET)
        //keep this token to user's cookie
        res.cookie("token",token,{expire:new Date() + 9999});

        //send response to frontend
        const {_id,name,email,role}=user;
        return res.json({token,user:{_id,name,email,role}});
    });
};

//signout
exports.signout=(req,res)=>{
    //clear the cookie
    res.clearCookie("token");

    //res.send("User Signout");

    //throwing json response
    res.json({
       message:"User Signout successfully"
    });

};

//protected routes
exports.isSignedIn = expressJwt({
    secret:process.env.SECRET,
    userProperty:"auth",
})

//custom middlewares
exports.isAuthenticated=(req,res,next)=>{
    let checker =req.profile && req.auth && req.profile._id == req.auth._id;
    if(!checker){
        return res.status(403).json({
            error:"Access Denied"
        })
    }
    next();
}

exports.isAdmin=(req,res,next)=>{
    if(req.profile.role === 0){
        return res.status(403).json({
          error:"You are not an admin,Access Denied"
        })
    }
    next();
}
