const mongoose=require('mongoose');
const {ObjectId}=mongoose.Schema;

const ProductCartSchema=new mongoose.Schema({
//It is not the product created here ,its the product already created in product.js
    product:{
      type:ObjectId,
      ref:"Product",
    },
    name:String,
    count:Number,
    price:Number, 
})

const ProductCart=mongoose.model("ProductCart",ProductCartSchema);

const orderSchema=new mongoose.Schema({
    //products which will be inside the cart not the actual product
    products:[ProductCartSchema],
    transaction_id:{},
    amount:{type:Number},
    address:String,
    updated:Date,
    user:{
        type:ObjectId,
        ref:"User",  //ref from user.js

    }
},{timestamps:true})

const Order=mongoose.model("Order",orderSchema);

module.exports={Order,ProductCart};

