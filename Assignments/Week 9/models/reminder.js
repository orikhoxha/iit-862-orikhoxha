var mongoose = require("mongoose");
ObjectId = mongoose.Schema.Types.ObjectId;


// This is our mongoose model for todos
var ReminderSchema = mongoose.Schema({
    title: String,
    description: String,
    created: String,
    owner: {type: ObjectId, ref: "User"}
});

var Reminder = mongoose.model("Reminder", ReminderSchema);

module.exports = Reminder;

