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

router.post("/register", function(req, res){
    User.findOne({username: req.body.username}, function(err, user){
        if (user){
            req.flash("error", "User with this usernamer already exists");
            return res.redirect("/register");
        } else {
            User.findOne({email: req.body.email}, function(err, user){
                if (user){
                    req.flash("error", "User with this email already exists");
                    return res.redirect("/register");
                } else {
                    crypto.randomBytes(20, function(err, buf){
                        var token = buf.toString('hex');
                        var newUser = new User({username: req.body.username, email: req.body.email, registerToken: token, registerTokenExpires: Date.now() + 1000 * 60 * 60 * 2});
                        User.register(newUser, req.body.password, function(err, user){
                            if (err){
                                req.flash("error", err.message + "!");
                                return res.redirect("/register");
                            } else {
                                var smtpTransport = nodemailer.createTransport({
                                    service: "Gmail",
                                    auth: {
                                        user: process.env.SENDER,
                                        pass: process.env.SENDERPASS
                                    }
                                });
                                var mailOptions = {
                                    to: user.email,
                                    from: "blogsposts@gmail.com",
                                    text: "Thank you for deciding to take a part in this project!\nTo confirm your email address please click on the following link http://" + req.headers.host + "/emailConfirm/" + token,
                                    subject: "Email confirmation"
                                }
                                smtpTransport.sendMail(mailOptions, function(err){
                                    if (err){
                                        console.log(err);
                                        req.flash("error", "Something wrong has happened!\nPlease contact the administration to solve this problem");
                                        res.redirect("/blogs");
                                    } else {
                                        res.render("register/confirmMessage");
                                        console.log("sent");
                                    }
                                    
                                });  
                            };
                        });
                    }); 
                }
            });
        }
    });  
});

//Confirm Route
router.get("/emailConfirm/:token", function(req, res){
    User.findOne({registerToken: req.params.token}, function(err, user){
        if (!user){
            req.flash("error", "It seems that you have already confirmed your email");
            return res.redirect("/blogs");
        }
        user.isConfirmed = true;
        user.registerToken = undefined;
        user.registerTokenExpires = undefined;
        user.save(function(err){
            req.flash("success", "Hello, " + user.username + "!\nYour email has been confirmed successfuly!");
            res.redirect("/blogs");
        });
    });
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