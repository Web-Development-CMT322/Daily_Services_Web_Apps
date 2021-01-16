//jshint esversion:6
require('dotenv').config()

var pass = " ";
var valid = " ";
var array = [];
var passwrong = " ";
var sendError = " ";

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
var Userprofile = " ";

var ServiceType = " ";
var ServiceName = " ";
var ServiceSummary = " ";
var ServiceArea = " ";
var ServiceState = " ";
var ServicePrice = " ";
var ServiceTime = " ";
var ServicePhone = " ";
var ServiceImage = " ";

const bodyParser = require("body-parser");;
const express = require("express");
const https = require("https");
const ejs = require("ejs")
const app = express();
const bcrypt = require("bcrypt");
const saltRounds = 10;

const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

const mongoose = require('mongoose')

//Start MongoDB
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(express.static(path.join(__dirname, '..', 'public' )))
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
  userSummary: String,
  userProfile: String
});

const dataService = new mongoose.Schema({
  serviceEmail: String,
  serviceType: String,
  serviceName: String,
  serviceSummary: String,
  serviceArea: String,
  serviceState: String,
  servicePrice: String,
  serviceTime: String,
  servicePhone: String,
  serviceImage: String
});

const User = mongoose.model("UserData", dataUser);
const Service = mongoose.model("ServiceData", dataService);

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
    userSummary: " ",
    userProfile: " "

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
            Userprofile = foundUser.userProfile;

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

  Service.find({serviceEmail:UserEmail}, function(err, foundItems){
      console.log(foundItems);
      console.log(UserEmail);
      res.render('UserProfile.ejs', {ServicesList:foundItems, Name: nameofUser, Email:UserEmail, FullName:UserFullName, Add1:UserAddr1, Add2:UserAddr2, City:UserCity, State:UserState, Postcode:UserPoscode, Gender:UserGender, PhoneNum:UserPhone, Summary:UserSummary, ImageProfile:Userprofile});
  })
});

app.post("/deleteData", function(req, res){

  var itemtodelete = req.body.deleteItem;
  Service.deleteOne({_id:req.body.deleteItem}, function(err){

    if(err){
      console.log(err);
    }else{
      console.log("Successful");
      res.redirect("UserProfile");
    }
  })
});
////////////////////////////////////////////////////

app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})

//////////// Personal Service Part/////////////////

app.get('/personal', (req, res) => {

  Service.find({serviceType:"Personal Services"}, function(err, foundItemMain){
      console.log(foundItemMain);
      res.render('Personal_Services.ejs', {PersonalList:foundItemMain, Naming: nameofUser});
  })
});

///////////////////////////////////////////////////

//////////// Home Service Part/////////////////

app.get('/home', (req, res) => {

  Service.find({serviceType:"Home Services"}, function(err, foundItemHome){
      console.log(foundItemHome);
      res.render('Home_Services.ejs', {HomeList:foundItemHome, Naming: nameofUser});
  })
})

///////////////////////////////////////////////////

//////////// Children Service Part/////////////////

app.get('/children', (req, res) => {

  Service.find({serviceType:"Children Services"}, function(err, foundItemChild){
      console.log(foundItemChild);
      res.render('Children_Services.ejs', {ChildList:foundItemChild, Naming: nameofUser});
  })
})

///////////////////////////////////////////////////

//////////// Event Service Part/////////////////

app.get('/event', (req, res) => {

  Service.find({serviceType:"Event Services"}, function(err, foundItemEvent){
      console.log(foundItemEvent);
      res.render('Event_Services.ejs', {EventList:foundItemEvent, Naming: nameofUser});
  })
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

  User.updateOne({_id:UserID}, {userProfile: req.body.linkProfile}, function(err){
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
              Userprofile = foundUser.userProfile;

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

/////////////// Upload services ////////////////

app.post('/uploadService', async (req, res) => {

  Service.findOne({serviceEmail: UserEmail}, function(err, foundUser){

    const service = new Service({

      serviceType: req.body.servicetype,
      serviceName: req.body.servicename,
      serviceSummary: req.body.servicesum,
      serviceArea: req.body.servicearea,
      serviceState: req.body.servicestate,
      servicePrice: req.body.serviceprice,
      serviceTime: req.body.servicetime,
      servicePhone: req.body.servicephone,
      serviceImage: req.body.linkService,
      serviceEmail: UserEmail,

    });
    service.save();
    res.redirect("UserProfile");

  });
});

app.get('/errorpage', (req, res) => {
  res.render('/pop-up-error.ejs')
})
/////////////////Log Out/////////////////////
app.get('/logout', (req, res) => {
  res.redirect('/')
})

/////////////////Start server/////////////////////
app.listen(process.env.PORT || 8000, function() {
  console.log("App listening on port 8000!")
});
