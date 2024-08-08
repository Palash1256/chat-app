const express=require("express");
const cors=require("cors");
require("dotenv").config();
const connectDB = require("./config/connectDB");
// const app=express();
const router = require("./routes/router");
const bodyParser=require("body-parser")
const cookiesParser = require('cookie-parser')
const {app,server}= require('./socket/socket')


app.use(cors({
    origin:"https://chat-app-amber-nine-31.vercel.app",
    credentials:true
}));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookiesParser())
app.use(bodyParser.json())
const PORT=process.env.PORT || 8080


//api end points

app.use('/api',router)


connectDB().then(()=>{
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
})
