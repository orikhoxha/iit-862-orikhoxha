var mongoose = require("mongoose");
ObjectId = mongoose.Schema.Types.ObjectId;


// This is our mongoose model for todos
var ReminderSchema = mongoose.Schema({
    title: {
    	type:String,
    	required: true
    },
    description: {
    	type:String,
    	required:true
    },
    created: String,
    owner: {type: ObjectId, ref: "User"}
});

var Reminder = mongoose.model("Reminder", ReminderSchema);

module.exports = Reminder;

