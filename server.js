//jshint esversion:6
require('dotenv').config()

var pass = " ";
var valid = " ";
var array = [];
var passwrong = " ";

var nameofUser = " ";
var UserID = " ";
var UserEmail = " ";
var UserFullName = " ";
var UserPassword = " ";
var UserAddr1 = " ";
var UserAddr2 = " ";
var UserCity = " ";
var UserState = " ";
var UserPoscode = " ";
var UserGender = " ";
var UserPhone = " ";
var UserSummary = " ";
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
  userPassword: String,
  fullName: String,
  userAddress1: String,
  userAddress2: String,
  userCity: String,
  userState: String,
  userPostcode: String,
  userGender: String,
  userPhone: String,
  userSummary: String
});

const User = mongoose.model("UserData", dataUser);

////////////////////////////////////////////////////////////////////////////////////////////////

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}))
app.use(methodOverride('_method'))
app.use(express.static("public"));

///////////////////////////////////////////////////////////////////////////////////////////////

app.get("/", function(req, res){
  res.render('index.ejs');
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
    userPassword: hashedPassword,
    fullName: " ",
    userAddress1: " ",
    userAddress2: " ",
    userCity: " ",
    userState: " ",
    userPostcode: " ",
    userGender: " ",
    userPhone: " ",
    userSummary: " "
  });

  user.save();
  res.redirect('/login')

})

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
            nameofUser = foundUser.userName;
            UserID = foundUser._id;
            UserEmail = useremail;
            UserPassword = userpassword;
            UserFullName = foundUser.fullName;
            UserAddr1 = foundUser.userAddress1;
            UserAddr2 = foundUser.userAddress2;
            UserCity = foundUser.userCity;
            UserState = foundUser.userState;
            UserPoscode = foundUser.userPostcode;
            UserGender = foundUser.userGender;
            UserPhone = foundUser.userPhone;
            UserSummary = foundUser.userSummary;
            res.redirect("UserProfile");
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
/////////////////User profile///////////////////////

app.get("/UserProfile", function(req, res){

  res.render('UserProfile.ejs', {Name: nameofUser, Email:UserEmail, FullName:UserFullName, Add1:UserAddr1, Add2:UserAddr2, City:UserCity, State:UserState, Postcode:UserPoscode, Gender:UserGender, PhoneNum:UserPhone, Summary:UserSummary});
});

////////////////////////////////////////////////////

app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})

//////////// Personal Service Part/////////////////

app.get('/personal', (req, res) => {
  res.render('Personal_Services.ejs', {Naming: nameofUser})
})

///////////////////////////////////////////////////

//////////// Home Service Part/////////////////

app.get('/home', (req, res) => {
  res.render('Home_Services.ejs', {Naming: nameofUser})
})

///////////////////////////////////////////////////

//////////// Children Service Part/////////////////

app.get('/children', (req, res) => {
  res.render('Children_Services.ejs', {Naming: nameofUser})
})

///////////////////////////////////////////////////

//////////// Event Service Part/////////////////

app.get('/event', (req, res) => {
  res.render('Event_Services.ejs', {Naming: nameofUser})
})

///////////////////////////////////////////////////

//// After sign in user can go to main menu //////

app.get('/goMainMenu', (req, res) => {
  res.render('mainMenuAfterSignIn.ejs', {Naming: nameofUser})
})

///////////////////////////////////////////////////

//// Pass username to header //////

app.get('/headerSecond', (req, res) => {
  res.render('headerSecond.ejs', {Naming: nameofUser})
})

///////////////////////////////////////////////////

app.get('/updateInfo', (req, res) => {

  res.redirect('/securitylogin')
})

app.post('/updateInfo', function(req, res) {

  User.updateOne({_id:UserID}, {fullName: req.body.inputFullName}, function(err){
    if(err){
      console.log(err);
    }else{
      console.log("Successful");
    }
  });

  User.updateOne({_id:UserID}, {userName: req.body.inputName4}, function(err){
    if(err){
      console.log(err);
    }else{
      console.log("Successful");
    }
  });

  User.updateOne({_id:UserID}, {userAddress1: req.body.inputAddress}, function(err){
    if(err){
      console.log(err);
    }else{
      console.log("Successful");
    }
  });

  User.updateOne({_id:UserID}, {userAddress2: req.body.inputAddress2}, function(err){
    if(err){
      console.log(err);
    }else{
      console.log("Successful");
    }
  });

  User.updateOne({_id:UserID}, {userCity: req.body.inputCity}, function(err){
    if(err){
      console.log(err);
    }else{
      console.log("Successful");
    }
  });

  User.updateOne({_id:UserID}, {userState: req.body.inputState}, function(err){
    if(err){
      console.log(err);
    }else{
      console.log("Successful");
    }
  });

  User.updateOne({_id:UserID}, {userPostcode: req.body.inputZip}, function(err){
    if(err){
      console.log(err);
    }else{
      console.log("Successful");
    }
  });

  User.updateOne({_id:UserID}, {userGender: req.body.inputGender}, function(err){
    if(err){
      console.log(err);
    }else{
      console.log("Successful");
    }
  });

  User.updateOne({_id:UserID}, {userPhone: req.body.inputPhone}, function(err){
    if(err){
      console.log(err);
    }else{
      console.log("Successful");
    }
  });

  User.updateOne({_id:UserID}, {userSummary: req.body.exampleFormControlTextarea1}, function(err){
    if(err){
      console.log(err);
    }else{
      console.log("Successful");
    }
  });

  res.redirect('/updateInfo')

});

app.get('/securitylogin', (req, res) => {
  res.render('securitylogin.ejs', {wrongemail: passwrong})
})

app.post('/securitylogin', function(req, res) {

  const useremail = req.body.emailvalid;
  const userpassword = req.body.passwordvalid;

  if(useremail !== UserEmail){
    passwrong = "Wrong email enter for validation"
    res.redirect("/securitylogin");
  }else{
    User.findOne({userEmail: useremail}, function(err, foundUser){

      if(err){
        console.log(err);
      }else{
        if(foundUser){
          bcrypt.compare(userpassword, foundUser.userPassword, function(err, result) {
            // result == true
            if(result === true ){
              nameofUser = foundUser.userName;
              UserID = foundUser._id;
              UserEmail = useremail;
              UserPassword = userpassword;
              UserFullName = foundUser.fullName;
              UserAddr1 = foundUser.userAddress1;
              UserAddr2 = foundUser.userAddress2;
              UserCity = foundUser.userCity;
              UserState = foundUser.userState;
              UserPoscode = foundUser.userPostcode;
              UserGender = foundUser.userGender;
              UserPhone = foundUser.userPhone;
              UserSummary = foundUser.userSummary;
              res.redirect("UserProfile");
            }else{
              passwrong = "Please enter again password";
              res.redirect("/securitylogin");
            }
          });
        }
      }
    });
  }

});

/////////////////Log Out/////////////////////
app.get('/logout', (req, res) => {
  res.redirect('/')
})

/////////////////Start server/////////////////////
app.listen(process.env.PORT || 8000, function() {
  console.log("App listening on port 8000!")
});
