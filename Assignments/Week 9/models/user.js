var mongoose = require("mongoose");

// This is our mongoose model for todos
var UserSchema = mongoose.Schema({
    name: String,
    email: String 
});

var User = mongoose.model("User", UserSchema);

module.exports = User;

