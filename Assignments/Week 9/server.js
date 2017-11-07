var express = require("express"),
    http = require("http"),
    path = require("path"),
    // import the mongoose library
    mongoose = require("mongoose"),
    UsersController = require("./controllers/users_controller.js"),
    RemindersController = require("./controllers/reminders_controller.js"),
    HomeController = require("./controllers/home_controller.js");
    app = express();
    var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '/views')));
app.use(bodyParser.json());

app.set('views', path.join(__dirname + '/views'));
app.engine('handlebars', exphbs({defaultLayout:'main',
								 partialsDir: __dirname + '/views/partials'}));
app.set('view engine', 'handlebars');



mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/user_reminders');




http.createServer(app).listen(port);



app.get("/", UsersController.index);

app.get("/users", UsersController.users);


app.get("/users/:userId",UsersController.show);
app.get("/users/:userId/reminders",RemindersController.index);
app.get("/users/:userId/reminders/:reminderId", RemindersController.show);

app.get("/users/:userId/reminderlist", RemindersController.reminders);


app.post("/users",UsersController.create);
app.post("/users/:userId/reminders",RemindersController.create);

app.put("/users/:userId", UsersController.update);
app.put("/users/:userId/reminders/:reminderId", RemindersController.update);

app.delete("/users/:userId", UsersController.destroy);
app.delete("/users/:userId/reminders", RemindersController.destroy);
app.delete("/users/:userId/reminders/:reminderId", RemindersController.destroy);



