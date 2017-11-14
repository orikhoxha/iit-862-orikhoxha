var Reminder = require("../models/reminder.js");
var mongoose = require("mongoose");
var User = require("../models/user.js");

var RemindersController = {};



var reminderProjection = { 
    __v: false,
    owner: false
};



RemindersController.index = function(req,res){

	var userId = req.params.userId || null,
	respondWithReminders;

	var titleParam = req.param("title") || null;


	respondWithReminders = function(query){
		Reminder.find(query,reminderProjection, function(err,reminders){
			if(err != null){
				res.status(500).send();
			}else{
				if(reminders.length !== 0){
					res.status(200).send(reminders);
				}else{
					res.status(404).send();
				}
				
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
					res.status(404).send();
				}
			});
		}
	}else{
		res.status(404).send();
	}

	
};

RemindersController.show = function(req,res){

	var userId = req.params.userId || null,
	reminderId= req.params.reminderId || null,
	respondWithReminder;


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
					if(err){
						res.status(500).send();
					}else if(user !== null){
						respondWithReminder({"_id": reminderId,"owner":user._id})
					}else{
						res.status(404).send();
					}
				});
			}
		}else{
			res.status(404).send();
		}
		
	}else{
		res.status(404).send();
	}

	
};


RemindersController.create = function(req,res){
	var userId = req.params.userId;
	var reminderReq = req.body;
	newReminder =  new Reminder(
			{"title":reminderReq.title,"description": reminderReq.description,
			 "created":new Date().toString()});
	

	if(mongoose.Types.ObjectId.isValid(userId)){
		User.findOne({_id:userId}, function(err,user){
			if(err){
				res.status(500).send();
			}else{
				if(user === null){
					res.status(404).send();
				}else{
					newReminder.owner = user._id;
					newReminder.save(function(err,reminder){
						if(err){
							res.status(500).send(err);
						}else{
							if(reminder !== null){
								res.status(200).send({id: reminder.id});
							}else{
								res.status(404).send();
							}
							
						}
					});
				}
			}
		});
	}else{
		res.status(404).send();
	}
	
};

RemindersController.destroy = function(req,res){
	var userId = req.params.userId;
	var reminderId = req.params.reminderId || null;
	var removeReminder;



	if(mongoose.Types.ObjectId.isValid(userId)){
		removeReminder = function(query){
			Reminder.remove(query,function(err,result){
				if(err !== null){
					res.status(500).send("ERROR");
				}else{
					res.status(204).send();
				}
			});
		}

	//Check if userId is valid
		if(mongoose.Types.ObjectId.isValid(userId)){
			if(reminderId !== null){
				if(mongoose.Types.ObjectId.isValid(reminderId)){
					removeReminder({_id: reminderId, owner: userId});
				}else{
					res.status(404).send();
				}
			}else{
				removeReminder({owner:userId});
			}
		}else{
			res.send({"error":"User not found"});
		}
	}else{
		res.status(404).send();
	}

	
}

module.exports = RemindersController;