var express = require("express"),
    http = require("http"),
    mongoose = require("mongoose"),
    UsersController = require("./controllers/users_controller.js"),
    RemindersController = require("./controllers/reminders_controller.js"),
    app = express();
var bodyParser = require('body-parser');
let config = require('config');

// const port = process.env.PORT || 3000;

const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));               
app.use(bodyParser.text());                                    
app.use(bodyParser.json({ type: 'application/json'}));

mongoose.connect('mongodb://localhost:27017/user_reminder_db');

http.createServer(app).listen(port);

app.get("/users/:userId",UsersController.show);
app.get("/users/:userId/reminders",RemindersController.index);
app.get("/users/:userId/reminders/:reminderId", RemindersController.show);

app.post("/users",UsersController.create);
app.post("/users/:userId/reminders",RemindersController.create);

app.delete("/users/:userId", UsersController.destroy);
app.delete("/users/:userId/reminders", RemindersController.destroy);
app.delete("/users/:userId/reminders/:reminderId", RemindersController.destroy);

module.exports = app; 
