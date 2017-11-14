var mongoose = require("mongoose");

// This is our mongoose model for todos
var UserSchema = mongoose.Schema({
    name: {
    	type:String,
    	required: true
    },
    email: {
    	type: String,
    	required: true
    } 
});

var User = mongoose.model("User", UserSchema);

module.exports = User;

