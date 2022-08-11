var mongoose =require('mongoose');
const crypto =require('crypto');
const uuidv1=require('uuid/v1');
 // var Schema  = mongoose.Schema;

  var userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        maxlength:32,
        trim:true,
    },
    lastname:{
        type:String,
        maxlength:32,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
    },
    userinfo:{
        type:String,
        trim:true,
    },
    //TODO:come back here
    encry_password:{
        type:String,
        required:true,

    },
    salt:String,
    role:{
        type:Number,
        default:0   //higher the number greater the role
    },
    purchases:{
        type:Array,
        default:[],
    }
  },
    {timestamps:true}
  );
  userSchema.virtual("password")  //in actual what is being stored in the DB is encry_password
    .set(function(password){
        this._password=password  //password is now stored securely
        this.salt=uuidv1();   //one field has been set
        this.encry_password=this.securepassword(password); //another field has been set

    })
    //to take these fields back created using set
    .get(function(){
        return this._password
    })

  userSchema.methods={
      authenticate:function(plainpassword){
          //matching the password
           return this.securepassword(plainpassword)===this.encry_password;  
      },

      securepassword:function(plainpassword){
          if(!plainpassword) return "";
          try{
               return crypto
               .createHmac('sha256',this.salt)
               .update(plainpassword)
               .digest('hex');
          }
          catch(err){
              return "";
          }
      }
  }

  module.exports=mongoose.model("User",userSchema)