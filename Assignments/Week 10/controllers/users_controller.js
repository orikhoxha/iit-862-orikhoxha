var User = require("../models/user.js");
var Reminder = require("../models/reminder.js");
	UsersController = {};
var mongoose = require("mongoose");
ObjectId = mongoose.Schema.Types.ObjectId;


var userProjection = { 
    __v: false,
    _id: false
};


UsersController.show = function(req,res){

	var userId = req.params.userId;

		//If userId not valid immediately return 
	if(mongoose.Types.ObjectId.isValid(userId)){
		User.findOne({_id: userId},userProjection, function(err,user){
			if(err !== null){
				res.status(500).send();
			}else{
				if(user === null){
					res.status(404).send();
				}else{
					res.status(200).send(user);
				}	
			}
		});
	}else{
		res.status(404).send();
	}
};

UsersController.create = function(req,res){
	var userReq = req.body;
	var newUser = new User({"name":userReq.name,"email": userReq.email});
	newUser.save(function(err,user){
		if(err){
			res.status(500).send(err);
		}else{
			res.status(200).send({id:user._id});
		}
	});
};


UsersController.destroy = function(req,res){
	var userId = req.params.userId;
	//Check if userId is valid
	if(mongoose.Types.ObjectId.isValid(userId)){
		User.remove({_id: userId},function(err,user){
			if(err !== null){
				res.status(500).send();
			}else{
				if(user === null){
					res.status(404).send();
				}else{
					Reminder.remove({owner: userId},function(err,reminders){
						if(err !== null){
							res.status(500).send();
						}
						
					});
					res.status(204).send();
				}
			}
		});
	}else{
		res.status(404).send();
	}
}

module.exports = UsersController;


