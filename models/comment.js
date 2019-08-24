var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    title: String,
    created: {type: Date, default: Date.now}
});

var Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;