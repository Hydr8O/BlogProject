var Blog = require("../models/blog");
var Comment = require("../models/comment");

var middleware = {}

middleware.isLoggedIn = function (req, res, next){
    if (req.isAuthenticated()){
        next();
    } else {
        req.flash("error", "You need to login first!");
        res.redirect("/login");
    }
}

middleware.checkBlogOwnership = function (req, res, next){
    if (req.isAuthenticated()){
        Blog.findById(req.params.id, function(err, foundBlog){
            if (err){
                res.send("Something went wrong!");
            } else {
                if (foundBlog.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You don't have permissions to da that!");
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("/login");
    }
}

middleware.checkCommentOwnership = function(req, res, next){
    if (req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, found){
            if (err){
                console.log("WHAT?");
            } else {
                if (found.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You don't have permissions to do that!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to login first!");
        res.redirect("/login");
    }
}

module.exports = middleware;