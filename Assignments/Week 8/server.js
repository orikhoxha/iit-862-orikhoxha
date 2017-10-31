var express = require('express');
var bodyParser = require('body-parser');
var url = require('url');




//Start id of users 0;
var userIds = 0;

//Start ids of reminders 0
var reminderIds = 0;

//Define Model Reminder
var Reminder = function(title,description,userId){
	this.id = generateReminderId();
	this.title = title;
	this.description = description;
	this.created = new Date();
	this.userId = userId;
};

//Define Model User
var User = function(name, email){
	this.id = generateUserId();
	this.name = name;
	this.email = email;
};


function generateUserId(){
 	return userIds++;
}

function generateReminderId(){
	return reminderIds++;
}

//Define empty users collections
var users = [];

//Define empty reminders collection
var reminders = [];


var app = express();
const port = process.env.PORT || 3000;

//Parse json body
app.use(bodyParser.json());


app.get("/users/:userId",function(req,res){
	var userIdSearch = Number(req.params.userId);
	var returnUser =  null;

	returnUser = findUserByID(userIdSearch);

	if(returnUser !== null){
		res.status(200).send({name: returnUser.name, email: returnUser.email});
	}else{
		res.status(404).send({error:'User not found'});
	}

});


app.get("/users/:userId/reminders",function(req,res){


	var userIdSearch = Number(req.params.userId);
	var titleQuery = req.param("title");
	console.log("title:" + titleQuery);
	var remindersRet = [];

	var queryByTitle = titleQuery !== undefined  ? true : false;

	for(var i = 0; i < reminders.length;i++){

		if(userIdSearch === Number(reminders[i].userId)){
			if(queryByTitle){
				if(reminders[i].title.indexOf(titleQuery) !== -1){
					remindersRet.push(reminders[i]);
				}
			}else{
				remindersRet.push(reminders[i]);
			}
		}
	}

	if(remindersRet.length !== 0){
		var retVal = customReminderArrayJSON(remindersRet);
		res.status(200).send({reminders: retVal});
	}else{	
		res.status(404).send({error:'No reminders found with this user'});
	}

});


app.get("/users/:userId/reminders/:reminderId",function(req,res){
	var userIdSearch = Number(req.params.userId);
	var reminderIdSearch = Number(req.params.reminderId);

	returnReminder = findReminderByIdUserId(userIdSearch,reminderIdSearch);

	if(returnReminder !== null){
		res.status(200).send(customReminderJSON(returnReminder));
	}else{
		res.status(404).send({error:" Could  not find reminder with id: " + reminderIdSearch});
	}

});



app.post('/users',function(req,res){
	var userPost = req.body.user;
	var user = new User(userPost.name, userPost.email);
	console.log(user);
	users.push(user);
	res.status(200).send({userId:user.id});
});

app.post('/users/:userId/reminders',function(req,res){
	

	var reminderPost = req.body.reminder;
	var userIdParam = Number(req.params.userId);

	if(findUserByID(userIdParam) === null){
		res.status(404).send({error: "User not found"});
	}else{
		var reminder = new Reminder(reminderPost.title,reminderPost.description,userIdParam);
		reminders.push(reminder); 
		res.status(200).send({reminderId:reminder.id});
	}
});


app.delete("/users/:userId",function(req,res){

	var userIdParam = Number(req.params.userId);


	var userToDelete = findUserByID(userIdParam);

	if(userToDelete !== null){
		for(var i = 0; i < reminders.length;i++){
			if(reminders[i].userId === userIdParam){
				reminders.splice(i,1);
				i = -1;
			}
		}
		res.status(204).send();
	}else{
		res.status(404).send({error:'User not found'});
	}
	
});


app.delete("/users/:userId/reminders",function(req,res){

	var userIdParam = Number(req.params.userId);

	var user = findUserByID(userIdParam);

	if(user === null){
		res.status(404).send({error:'User not found'});
	}else{


		for(var i = 0; i < reminders.length;i++){
			if(reminders[i].userId === userIdParam){
				reminders.splice(i,1);
				i = -1;
			}
		}

		res.status(204).send();
	}
});

app.delete("/users/:userId/reminders/:reminderId",function(req,res){

	var userIdParam = Number(req.params.userId);
	var reminderId = Number(req.params.reminderId);

	var user = findUserByID(userIdParam);

	if(user === null){
		res.status(404).send({error:'User not found'});
	}else{

		var reminder = findReminderById(reminderId);

		if(reminder === null){
			res.status(404).send({error:"Reminder not found"});
		}else{
			for(var i = 0; i < reminders.length;i++){
				if(reminders[i].userId === userIdParam && reminders[i].id === reminderId){
					reminders.splice(i,1);
					break;
				}
			}
			res.status(204).send();
		}
	}
});


app.listen(port,function(){
	console.log(`Started and running on port: ${port}`);
});



function customReminderArrayJSON(array){
	var json = [];
	for(var i = 0; i < array.length;i++){
		json.push({userId: array[i].userId,title: array[i].title, description:array[i].description, created:array[i].created});
	}
	return json;
}

function customReminderJSON(reminder){
	var json = {userId: array[i].userId,title:reminder.title, description: reminder.description, created: reminder.created};
	return json;
}


function findUserByID(userId){

	for(var i = 0; i < users.length;i++){
		if(users[i].id === userId){
			returnUser = users[i];
			return returnUser;
		}
	}
	return null;
}



function findReminderById(reminderId){
	for(var i = 0 ;i< reminders.length;i++){
		if(reminders[i].id === reminderId){
			return reminders[i];
		}
	}

	return null;
}


function findReminderByIdUserId(pUserId, pReminderId){

	var retVal;

	for(var i = 0; i < reminders.length; i++){
		if(reminders[i].userId === pUserId && reminders[i].id === pReminderId){
			retVal = reminders[i];
			console.log(retVal);
		}
	}
	return retVal !== null ? retVal : null;
}


