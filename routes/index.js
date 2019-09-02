var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");
var nodemailer = require("nodemailer");
var crypto = require("crypto");
var bodyParser = require("body-parser");


router.use(bodyParser.urlencoded({extended: true}));
router.get("/", function(req, res){
    res.redirect("/blogs");
});


//Sign Up Route

router.get("/register", function(req, res){
    res.render("register/register");
});


router.post("/register", async (req, res) => {
    try{
        await User.findOne({username: req.body.username}).then(user => {
            if (user){
                throw "User with this username already exists";
            }
        });
        await User.findOne({email: req.body.email}).then(user => {
            if (user){
                throw "User with this email already exists";
            }
        });
        const token = await new Promise((resolve, reject) => {
            crypto.randomBytes(20, (err, buf) => {
                if (!buf){
                    reject ("Something wrong with crypto");
                } else {
                    resolve (buf.toString("hex"));
                } 
            });
        }).then(token => token).catch(err => {throw err});
        const newUser = ({username: req.body.username, email: req.body.email, registerToken: token, registerTokenExpires: Date.now() + 1000 * 60 * 60 * 2});
        const registeredUser = await User.register(newUser, req.body.password).catch(err => {throw err});
        const smtpTransport = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.SENDER,
                pass: process.env.SENDERPASS
            }  
        });
        const mailOptions = {
            to: registeredUser.email,
            from: "",
            text: "Thank you for deciding to take a part in this project!\nTo confirm your email address please click on the following link http://" + req.headers.host + "/emailConfirm/" + token,     
            subject: "Email confirmation"
        }
        await smtpTransport.sendMail(mailOptions).catch(err => {throw err});
        res.render("register/confirmMessage");
    } catch(err){
        req.flash("error", err);
        console.log(err);
        res.redirect("/register");
    }
});


//Confirm Route

router.get("/emailConfirm/:token", async (req, res) =>{
    try{
        let user = await User.findOne({registerToken: req.params.token}).then(user =>{
            if (!user){
                throw "err";
            } else {
                return user;
            }
        });
        user.isConfirmed = true;
        user.registerToken = undefined;
        user.registerTokenExpires = undefined;
        await user.save();
        req.flash("success", "Hello, " + user.username + "!\nYour email has been confirmed successfuly!");
        res.redirect("/blogs");
    } catch (err){
        req.flash("error", err);
        res.redirect("/blogs");
    }
    

});

//Login Route
router.get("/login", function(req, res){
    res.render("register/login"); 
});

router.post("/login", passport.authenticate("local", 
    {
        failureRedirect: "/login",
        failureFlash: true,
    }), function(req, res){
        req.flash("success", "Welcome, " + req.user.username + "!");
        res.redirect("/blogs");
    }
);


//Logout Route
router.get("/logout", function(req, res){
   req.logOut();
   req.flash("success", "Logged out successfully");
   res.redirect("/blogs");
});

//Checks if there are any users who hasn't confirmed their emails in 12 hours. If there are => delete them.
deleteFakeUsers()

function deleteFakeUsers(){
    setInterval(checkToken, 1000 * 60 * 60 * 6);
}


function checkToken(){
    User.deleteMany({registerTokenExpires: {$lt: Date.now(), $exists: true}}, function(err, deleted){
        if (deleted.deletedCount){
            console.log(deleted);
        }
    });
}

module.exports = router;