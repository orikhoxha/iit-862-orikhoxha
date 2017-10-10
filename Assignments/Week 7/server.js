var express = require('express');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;


//Define schema for the hand
var Hand = mongoose.model('Hand',{
	cards:{
		type:[]
	}
});

var app = express();
const port = process.env.PORT || 3000;

//Parse json body
app.use(bodyParser.json());


app.get("/hands/:handId",function(req,res){
	Hand.findById(req.params.handId).then(function(hand){
		res.send({id: hand._id, cards: hand.cards});
	},function(err){
		res.status(404).send({"status":404});
	});
});

app.get("/hands/:handId/cards",function(req,res){
	Hand.findById({_id:req.params.handId},'cards').then(function(hand){
		res.send(hand.cards);
	},function(err){
		res.status(404).send({"status":404});
	});
});

app.post('/hands',function(req,res){

	var hand = new Hand();
	hand.cards = req.body;

	hand.save().then(function(doc){
		res.status(200);
		res.json({status:200,id:doc._id})
	},function(err){
		console.log(err);
		res.send(err);
	});

});

app.put('/hands/:handId', function(req, res) {
  var id = req.params.handId,
       body = req.body;
       console.log(body);


   Hand.update({ _id: id }, { $set: { cards: body }}, function(err){
   		if(err){
   			res.status(404);
   			res.send({status:404});
   		}else{
   			res.status(204);
   			res.send();
   		}
   });
 }); 
  

app.listen(port,function(){
	console.log(`Started and running on port: ${port}`);
});

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/PokerHand');
