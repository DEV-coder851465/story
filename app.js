//jshint esversion:6
const express=require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});

const app=express();
app.set("view engine","ejs");

const userSchema= new mongoose.Schema({
  Username:String,
  password:Number
});

const secret="thisisourseceret";

userSchema.plugin(encrypt,{secret:secret,encryptedFields:["password"]});

const User=mongoose.model("User",userSchema);


app.use(express.static("public"));
app.use(bodyParser.urlencoded({extension:true}));


app.get("/",function(req,res){
res.render("home",{
})});

app.get("/login",function(req,res){
  res.render("login")
})

app.get("/register",function(req,res){
  res.render("register")
})

app.post("/register",function(req,res){
  const user=new User({
    email:req.body.username,
    password:req.body.password
  });
  user.save(function(err){
    if(err){
      console.log("err");
    }
    else{
      res.render("secrets")
    }
  }
)})

app.post("/login",function(req,res){
  const username=req.body.username;
  const password=req.body.password;

  User.findOne({email:username},function(err,foundOne){
    if(err){
      console.log("err");
    }
    else{
      if(foundOne){
        if (foundOne.password===password){
          res.render("secrets")
        }
      }
    }
  })
});




app.listen(3000,function(){
  console.log("server is listening on port 3000");
});
