var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = mongoose.Schema({
    username: String, 
    password: String,
    registerToken: String,
    registerTokenExpires: Date,
    email: {type: String, require: true},
    isConfirmed: {type: Boolean, default: false}
});

UserSchema.plugin(passportLocalMongoose, {
    // Set usernameUnique to false to avoid a mongodb index on the username column!
  
    findByUsername: function(model, queryParameters) {
      // Add additional query parameter - AND condition - active: true
      queryParameters.isConfirmed = true;
      return model.findOne(queryParameters);
    }
});

var User = mongoose.model("User", UserSchema);
module.exports = User;