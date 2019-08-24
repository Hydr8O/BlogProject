var express = require("express");
var router = express.Router();
var Blog = require("../models/blog");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//New route
router.get("/blogs/:id/comments/new", middleware.isLoggedIn, function(req, res){
    Blog.findById(req.params.id, function(err, blog){
        if (err){
            console.log(err);
        } else {
            res.render("comments/new", {blog: blog});
        }
    });
});

//Create route
router.post("/blogs/:id/comments", middleware.isLoggedIn, function(req, res){
    Blog.findById(req.params.id, function(err, blog){
        if (err){
            console.log(err);
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if (err){
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    blog.comments.push(comment);
                    blog.save(function(err, saved){
                        if (err){
                            console.log(err)
                        } else {
                            res.redirect("/blogs/" + blog._id);
                        }
                    });
                }
            });
        }
    });
});

//Edit Route

router.get("/blogs/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if (err){
            res.redirect("/blogs/:id");

        } else {
            console.log(foundComment);
            res.render("comments/edit", {comment: foundComment, blogID: req.params.id});
        }
    });
});

//Update Route

router.put("/blogs/:id/comments/:comment_id/", middleware.checkCommentOwnership, function(req, res){
    console.log(req.body.comment);
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if (err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});


//Delete Route

router.delete("/blogs/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if (err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

module.exports = router;