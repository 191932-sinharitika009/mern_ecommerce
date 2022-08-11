require('dotenv').config()  //dotenv documentation

const mongoose = require('mongoose');

const express = require('express');
const app=express();
//needed to import middlewares before using
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

//Making connection with database
mongoose.connect(process.env.DATABASE,
{useNewUrlParser: true,
useUnifiedTopology: true,    //helps to keep our DB conneections alive
useCreateIndex:true,
}).then(()=>{
    console.log("DB CONNECTED");
});
// .catch(
//     console.log("OOPS...!! DB connection failed...!")
// )

//using middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//getting the created route
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");


//My Routes
app.use("/api",authRoutes);
app.use("/api",userRoutes);
app.use("/api",categoryRoutes);


//creating a port
const port=process.env.PORT || 8000;

//Starting a server
//app listens  on a port
app.listen(port,()=>{
    console.log(`app is running at ${port}`);
})