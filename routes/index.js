var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");

router.get("/", function(req, res){
    res.redirect("/blogs");
});


//Sign Up Route

router.get("/register", function(req, res){
    res.render("register/register");
});

router.post("/register", function(req, res){
   var newUser = new User({username: req.body.username});
   User.register(newUser, req.body.password, function(err, user){
        if (err){
            req.flash("error", err.message + "!");
           return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
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
        successRedirect: "/blogs",
        failureRedirect: "/login",
        failureFlash: true 
    })
);

//Logout Route
router.get("/logout", function(req, res){
   req.logOut();
   req.flash("success", "Logged out successfully");
   res.redirect("/blogs");
});


module.exports = router;