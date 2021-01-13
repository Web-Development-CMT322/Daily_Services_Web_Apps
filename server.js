//jshint esversion:6
require('dotenv').config()

var pass = " ";
const bodyParser = require("body-parser");;
const express = require("express");
const https = require("https");
const ejs = require("ejs")
const app = express();
const bcrypt = require("bcrypt");
const saltRounds = 10;

const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

const mongoose = require('mongoose')

//Start MongoDB
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.Promise = global.Promise;

mongoose.connect("mongodb+srv://group-20-web:Try12345@cluster20.sx3at.mongodb.net/userData?retryWrites=true&w=majority", { useUnifiedTopology: true, useNewUrlParser: true })

//Encryption start
const dataUser = new mongoose.Schema({
  userName: String,
  userEmail: String,
  userPassword: String
});

const User = mongoose.model("UserData", dataUser);

////////////////////////////////////////////////////////////////////////////////////////////////

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}))
app.use(methodOverride('_method'))
app.use(express.static("public"));

app.get("/UserProfile", function(req, res){
  res.render('UserProfile.ejs')
});

app.get("/", function(req, res){
  res.render('index.ejs');
});

app.get('/login', (req, res) => {
  res.render('login.ejs', {messages: pass})
})

app.post('/login', function(req, res) {

  const useremail = req.body.email;
  const userpassword = req.body.password;

  User.findOne({userEmail: useremail}, function(err, foundUser){

    if(err){
      console.log(err);
    }else{
      if(foundUser){
        bcrypt.compare(userpassword, foundUser.userPassword, function(err, result) {
          // result == true
          if(result === true ){
            res.render("UserProfile");
          }else{
            pass = "Please enter again password";
            res.redirect("login");
          }
        });
      }if(!foundUser){

        pass = "No user with that email";
        res.redirect("login");
      }
    }
  });
});

app.get('/register', (req, res) => {
  res.render('register.ejs')
})

app.post('/register', async (req, res) => {

  const hashedPassword = await bcrypt.hash(req.body.password, 10)

  // Store hash in your MongoDB
  const user = new User({

    userName: req.body.name,
    userEmail: req.body.email,
    userPassword: hashedPassword
  });

  user.save();
  res.redirect('/login')

})

app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})

// Personal Service Part
app.get('/personal', (req, res) => {
  res.render('UserProfile.ejs')
})

app.listen(process.env.PORT || 8000, function() {
  console.log("App listening on port 8000!")
});
