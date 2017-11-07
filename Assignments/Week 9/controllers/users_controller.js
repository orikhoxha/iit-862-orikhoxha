var User = require("../models/user.js");
var Reminder = require("../models/reminder.js");
	UsersController = {};
var mongoose = require("mongoose");
ObjectId = mongoose.Schema.Types.ObjectId;


var userProjection = { 
    __v: false
};

UsersController.index = function(req,res){

	User.find({},userProjection,function(err,users){

		var message = "";
		if(err !== null){
			console.log("Error", err);
		}else{
			res.render('users',{
			users:users,
			message: message
			});	
		}
	});
};

UsersController.users = function(req,res){
	User.find({},userProjection,function(err,users){
		if(err !== null){
			console.log("Error", err);
		}else{
			res.status(200).send(users);
		}
	});
}


UsersController.show = function(req,res){

	var userId = req.params.userId;
	console.log(userId);

	console.log("got in here");

	//If userId not valid immediately return 
	if(mongoose.Types.ObjectId.isValid(userId)){
		User.findOne({_id: userId},userProjection, function(err,user){
		if(err !== null){
			res.status(500).send();
		}else{
			if(user === null){
				res.status(404).send({error: "User not found"});
			}else{
				res.status(200).send(user);
			}	
		}
		
		});
	}else{
		res.status(404).send({"error": "User not found"});
	}
};

UsersController.create = function(req,res){

	var userReq = req.body.user;

	var newUser = new User({"name":userReq.name,"email": userReq.email});
	newUser.save(function(err,user){
		if(err != null){
			console.log(err);
			res.send("ERROR");
		}else{
			res.status(200).send(newUser);
		}
	});
};


UsersController.update = function (req, res) {
    console.log(req.body);
    var userId = req.params.userId;

    if(mongoose.Types.ObjectId.isValid(userId)){
    	User.findOne({_id : userId}, function (err, user) {
    		if(err !== null){
    			res.send("error");
    		}else if(user === null){
    			res.status(404).send({error: "User not found"});
    		}else{
    			user.name = req.body.name;
		    	user.email = req.body.email;
		    	user.save(function (err, result) {
					if (err !== null) {
					    // the element did not get saved!
					    console.log(err);
					    res.send("ERROR");
					} else {
						res.status(204).send("Updated");
					}
		    	});	
    		}
		    
    	});
    }else{
    	res.status(404).send({error:"User not found"});
    }
};


UsersController.destroy = function(req,res){
	var userId = req.params.userId;

	console.log(userId);

	//Check if userId is valid
	if(mongoose.Types.ObjectId.isValid(userId)){
		User.remove({_id: userId},function(err,user){
			if(err !== null){
				res.send("Error");
			}else{
				if(user === null){
					res.status(404).send({"error":"User not found"});
				}else{
					Reminder.remove({owner: userId},function(err,reminders){
						if(err !== null){
							res.send("ERROR");
						}
						
					});
					res.status(204).send();
				}
			}
		});
	}else{
		res.send({"error":"User not found"});
	}
}


module.exports = UsersController;


