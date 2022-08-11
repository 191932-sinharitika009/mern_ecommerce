const User =require("../models/user");
const order=require("../models/order");

exports.getUserById = (req,res,next,id)=>{
    User.findById(id).exec((err,user)=>{
        if(err || !user){
            return res.status(400).json({
                error:"No User was found in DB"
            })

        }
        req.profile = user;
        next();
    })
}

exports.getUser =(req ,res)=>{
    //TODO:get back here for password
    req.profile.salt=undefined;
    req.profile.encry_password=undefined;
    req.profile.updatedAt=undefined;
    req.profile.createdAt=undefined;
    return res.json(req.profile);
    
}
//Assignment
/*exports.getAllUsers=(req,res)=>{
   User.find().exec((err,users)=>{
       if(err || !users){
           return res.status(400).json({
               error:"No user found"
           })
       }
       return res.json(users);
   })

   
}  */  

//updating a created user
exports.updateUser =(req,res)=>{
    User.findByIdAndUpdate(
        {_id:req.profile._id},
        {$set:req.body},
        {new:true,useFindAndModify:false},
        (err,user)=>{
            if(err){
                return res.status(400).json({
                    error:"You are not authorized to update this user"
                })
            }
            user.salt=undefined;
            user.encry_password=undefined;
            res.json(user);
        }
    )
}

exports.userPurchaseList =(req,res)=>{
    Order.find({user:req.profile._id})
    .populate("user","_id name").exec((err , user)=>{
        if(err){
            return res.status(400).json({
                error:"No order in this Account"
            })
        }
        return res.json(order);
    })

}

exports.pushOrderInPurchaseList=(req,res,next)=>{

    let purchases=[]
    req.body.order.products.forEach(product=>{
        purchases.push({
            _id:product._id,
            name:product.name,
            description:product.description,
            categroy:product.categroy,
            quantity:product.quantity,
            amount:req.body.order.amount,
            transaction_id:req.body.order.transaction_id
        })
    })

    //Store this in DB
    User.findOneAndUpdate(
        {_id:req.profile._id},
        {$push:{purchases:purchases}},
        {new:true}, //send back the updated object from DB
        (err,purchases) => {
            if(err){
                return res.status(400).json({
                    error:"unable to save purchase list"
                })
            }
            next();
        }
    )
   
};

