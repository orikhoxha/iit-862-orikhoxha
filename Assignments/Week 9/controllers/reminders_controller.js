var Reminder = require("../models/reminder.js");
var mongoose = require("mongoose");
var User = require("../models/user.js");

var RemindersController = {};



var reminderProjection = { 
    __v: false
};



RemindersController.reminders = function(req,res){

	var userId = req.params.userId || null;

	Reminder.find({"owner":userId},reminderProjection,function(err,reminders){
		if(err !== null){
			console.log("Error", err);
		}else{
			res.status(200).send(reminders);
		}
	});
}


RemindersController.index = function(req,res){

	var userId = req.params.userId || null,
	respondWithReminders;


	var titleParam = req.param("title") || null;

	console.log("The user id" + userId);

	console.log(titleParam);

	respondWithReminders = function(query){
		Reminder.find(query,reminderProjection, function(err,reminders){
			if(err != null){
				res.status(500).send();
			}else{
				res.render('reminders',{
					reminders:reminders,
					userIdIn: userId
				});
			}
		});
	};

	//if userId not valid immediately return
	if(mongoose.Types.ObjectId.isValid(userId)){
		if(userId !== null){
			User.findOne({_id:userId},function(err,user){
				if(err != null){
					res.status(500).send();
				}else if(user !== null){
					if(titleParam !== null){
						respondWithReminders({"owner":user._id, "title":titleParam});	
					}else{
						respondWithReminders({"owner":user._id});
					}
					
				}else{
					res.status(404).send({"error:":"User not found"});
				}
			});
		}
	}else{
		res.status(404).send({"error": "User not found"});
	}

	
};

RemindersController.show = function(req,res){

	var userId = req.params.userId || null,
	reminderId= req.params.reminderId || null,
	respondWithReminder;

	console.log("Reminder Id:" + reminderId);



	respondWithReminder = function(query){
		Reminder.findOne(query,reminderProjection, function(err,reminder){
			if(err != null){
				res.status(500).send(err);
			}else{
				if(reminder === null){
					res.status(404).send();
				}else{
					res.status(200).send(reminder);	
				}
				
			}
		});
	};

	//If userId not valid immediately return 
	if(mongoose.Types.ObjectId.isValid(userId) ){
		if(mongoose.Types.ObjectId.isValid(reminderId)){
			if(userId !== null){
				User.findOne({_id:userId},function(err,user){
					if(err != null){
						res.status(500).send();
					}else if(user !== null){
						respondWithReminder({"_id": reminderId,"owner":user._id})
					}else{
						res.status(404).send({"error:":"User not found"});
					}
				});
			}
		}else{
			res.status(404).send({"error":"Reminder not found"});
		}
		
	}else{
		res.status(404).send({"error":"User not found"});
	}

	
};


RemindersController.create = function(req,res){
	var userId = req.params.userId;
	var reminderReq = req.body.reminder;
	newReminder =  new Reminder(
			{"title":reminderReq.title,"description": reminderReq.description,
			 "created":new Date().toString()});
	

	if(mongoose.Types.ObjectId.isValid(userId)){
		User.findOne({_id:userId}, function(err,user){
			if(err){
				res.status(500).send();
			}else{
				if(user === null){
					res.status(404).send({"error":"User not found"});
				}else{
					newReminder.owner = user._id;
					newReminder.save(function(err,reminder){
						if(err !== null){
							res.status(500).send(err);
						}else{
							res.status(200).send(newReminder);
						}
					});
				}
			}
		});
	}else{
		res.status(404).send({"error":"User not found"});
	}
	
};



RemindersController.update = function (req, res) {
    console.log(req.body);
    var userId = req.params.userId;
    var reminderId = req.params.reminderId;

    if(mongoose.Types.ObjectId.isValid(userId)){
    	User.findOne({_id : userId}, function (err, user) {
    		if(err !== null){
    			res.send("error");
    		}else if(user === null){
    			res.status(404).send({error: "User not found"});
    		}else{
    			if(mongoose.Types.ObjectId.isValid(reminderId)){
    				Reminder.findOne({_id : reminderId, owner: userId}, function(err,reminder){
    					if(err !== null){
    						res.send("ERROR");
    					}else if(reminder === null){
    							res.status(404).send({error:"Reminder doesn't exist"});
    					}else{
    						reminder.title = req.body.title;
	    					reminder.description = req.body.description;
	    					reminder.created = new Date().toString();
	    					reminder.save(function(err,reminder){
	    						if(err !== null){
	    							res.send("ERROR");
	    						}else{
	    							res.status(204).send("Updated");
	    						}
	    					});
    					}
    				});	
    			}else{
    				res.status(404).send({error: "Reminder  doesn't exist"});
    			}
    		}
    	});
    }else{
    	res.status(404).send({error:"User not found"});
    }
};



RemindersController.destroy = function(req,res){
	var userId = req.params.userId;
	var reminderId = req.params.reminderId || null;
	console.log(userId);
	var removeReminder;


	removeReminder = function(query){
		Reminder.remove(query,function(err,result){
			if(err !== null){
				res.status(500).send("ERROR");
			}else{
				res.status(204).send();
			}
		})
	}


	//Check if userId is valid
	if(mongoose.Types.ObjectId.isValid(userId)){

		if(reminderId !== null){
			if(mongoose.Types.ObjectId.isValid(reminderId)){
				removeReminder({_id: reminderId, owner: userId});
			}else{
				res.status(404).send({error: "Reminder not found"});
			}
		}else{
			removeReminder({owner:userId});
		}
	}else{
		res.send({"error":"User not found"});
	}
}

module.exports = RemindersController;