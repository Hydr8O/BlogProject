var express = require("express");
var router = express.Router();
var Blog = require("../models/blog")
var middleware = require("../middleware");



//Index Route
router.get("/blogs", function(req, res){
    Blog.find({}, function(err, blog){
        if (err){
            res.redirect("/");
        } else {
            res.render("blogs/index", {blog: blog});
        }
    });
});

//New Route
router.get("/blogs/new", middleware.isLoggedIn, function(req, res){
    res.render("blogs/new");
})

//Create Route
router.post("/blogs", middleware.isLoggedIn, function(req, res){
    var newBlog = {
        title: req.body.title,
        image: req.body.image,
        content: req.body.content,
        author: {
            id: req.user._id,
            username: req.user.username
        }
    }
    Blog.create(newBlog, function(err, createdBlog){
        if (err){
            res.redirect("/blogs/new");
        } else {
            req.flash("success", "Your post has been posted successfuly!");
            res.redirect("/blogs");
        }
    });
});

//Show Route
router.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id).populate("comments").exec(function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("blogs/show", {blog: foundBlog});
        }
    });
});

//Edit Route
router.get("/blogs/:id/edit", middleware.checkBlogOwnership, function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if (err){
            res.redirect("/blogs/:id/edit");
        } else {
            res.render("blogs/edit", {blog: foundBlog});
        }
    })
});

//Update Route
router.put("/blogs/:id", middleware.checkBlogOwnership, function(req, res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if (err){
            res.redirect("/blogs/:id/edit");
        } else {
            req.flash("success", "Your post has been edited successfuly!");
            res.redirect("/blogs");
        }
    });
});

//Delete Route
router.delete("/blogs/:id", middleware.checkBlogOwnership, function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if (err){
            res.redirect("/blogs/:id");
        } else {
            req.flash("success", "Your post has been deleted successfuly!");
            res.redirect("/blogs");
        }
    });
});



module.exports = router;