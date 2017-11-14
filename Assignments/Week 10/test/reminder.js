process.env.NODE_ENV = 'test';
let mongoose = require("mongoose");
let User = require('../models/user');
let Reminder = require('../models/reminder');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();


describe('Reminders', () => {
	
	describe('/GET Reminders', () => {
		it('it should not get reminders without a valid given user id', (done) => {
	  	let user = new User({
	  		name: "Orik Hoxha",
	  		email: "ohoxha@hawk.iit.edu"
	  	});

	  	let reminder = {
	  		title: "To do this",
	  		description: "To do the most important thing"
	  	};

	  	var invalidUserId = 123;

	  	user.save((err, user) => {
				chai.request(server)
			    .post('/users/' + user.id + '/reminders')
			    .send(reminder)
			    .end((err, res) => {
			    	chai.request(server)
			    	.get('/users/' + invalidUserId+ '/reminders')
			    	.end((err,res)=>{
			    		res.should.have.status(404);
			      		done();
			    	});
			    });
		  });
	  	});


	  it('it should GET reminders with a given user id', (done) => {
	  	let user = new User({
	  		name: "Orik Hoxha  -- Get reminder id",
	  		email: "ohoxha@hawk.iit.edu --  Get reminder id"
	  	});

	  	let reminder = {
	  		title: "To do this -- Get reminder id",
	  		description: "To do the most important thing -- Get reminder id"
	  	};

	  	user.save((err, user) => {
				chai.request(server)
			    .post('/users/' + user.id + '/reminders')
			    .send(reminder)
			    .end((err, res) => {
			    	chai.request(server)
			    	.get('/users/' + user.id + '/reminders')
			    	.end((err,res)=>{
			    		res.should.have.status(200);
				  		res.body.should.be.a('array');
			      		done();
			    	});
			    });
		  });
	  	});
	 });

	describe('/GET Reminder', () => {
	  it('it should GET reminders with a given user id', (done) => {
	  	let user = new User({
	  		name: "Orik Hoxha",
	  		email: "ohoxha@hawk.iit.edu"
	  	});

	  	let reminder = {
	  		title: "To do this -- Get reminder id",
	  		description: "To do the most important thing -- Get reminder id"
	  	};

	  	user.save((err, user) => {
				chai.request(server)
			    .post('/users/' + user.id + '/reminders')
			    .send(reminder)
			    .end((err, res) => {
			    	chai.request(server)
			    	.get('/users/' + user.id + '/reminders/'  + res.body.id)
			    	.end((err,res)=>{
			    		res.should.have.status(200);
				  		res.body.should.be.a('object');
				  		res.body.should.have.property('title');
			  			res.body.should.have.property('description');
			  			res.body.should.have.property('created');
			      		done();
			    	});
			    });
		  });
	  	});
	 });

  describe('/POST reminder', () => {


  	  it('it should not POST a reminder without description field', (done) => {
	  	let user = new User({
	  		name: "Orik Hoxha",
	  		email: "ohoxha@hawk.iit.edu"
	  	});

	  	let reminder = {
	  		title: "To do this POST reminder",
	  	};

		user.save((err, user) => {
				chai.request(server)
			    .post('/users/' + user.id + '/reminders')
			    .send(reminder)
			    .end((err, res) => {
			    	res.should.have.status(500);
				  	res.body.should.be.a('object');
		  			res.body.should.have.property('errors');
		  			res.body.errors.should.have.property('description');
			      done();
			    });
		  });
	  });


	  it('it should POST a reminder with a given user id ', (done) => {
	  	let user = new User({
	  		name: "Orik Hoxha  POST reminder ",
	  		email: "ohoxha@hawk.iit.edu POST reminder"
	  	});

	  	let reminder = {
	  		title: "To do this POST reminder",
	  		description: "To do the most important thing POST reminder"
	  	};

	  	user.save((err, user) => {
				chai.request(server)
			    .post('/users/' + user.id + '/reminders')
			    .send(reminder)
			    .end((err, res) => {
				  	res.should.have.status(200);
				  	res.body.should.be.a('object');
				  	res.body.should.have.property('id');
			      done();
			    });
		  });
	  });
  });


  describe('/delete/ reminder', () => {

  	 it('it should not delete reminders withou given valid user id', (done) => {

  	 	var invalidUserId = 123;

	  	let user = new User({name: "Orik", email: "orikhoxha@gmail.com"})
	  	user.save((err, user) => {
				chai.request(server)
			    .delete('/users/' + invalidUserId+ '/reminders')
			    .end((err, res) => {
				  	res.should.have.status(404);
			      done();
			    });
		  });
	  });


	  it('it should delete all reminders given the user id', (done) => {
	  	let user = new User({name: "Orik", email: "orikhoxha@gmail.com"})
	  	user.save((err, user) => {
				chai.request(server)
			    .delete('/users/' + user.id + '/reminders')
			    .end((err, res) => {
				  	res.should.have.status(204);
			      done();
			    });
		  });
	  });
  });

  describe('/delete/ reminder', () => {
  	  it('it should not delete reminder given the invalid reminder id', (done) => {
	  	let user = new User({name: "Orik", email: "orikhoxha@gmail.com"})
		var invalidReminderId = 123;
	  	let reminder = {
	  		title: "To do this POST reminder",
	  		description: "To do the most important thing POST reminder"
	  	};

	  	user.save((err, user) => {
				chai.request(server)
			    .post('/users/' + user.id + '/reminders')
			    .send(reminder)
			    .end((err, res) => {
			    	chai.request(server)
			    	.delete('/users/' + user.id + '/reminders/'  + invalidReminderId)
			    	.end((err,res)=>{
			    		res.should.have.status(404);
			      		done();
			    	});
			    });
		  });
	  });


	  it('it should delete reminder given the user id and reminder id', (done) => {
	  	let user = new User({name: "Orik", email: "orikhoxha@gmail.com"})

	  	let reminder = {
	  		title: "To do this POST reminder",
	  		description: "To do the most important thing POST reminder"
	  	};

	  	user.save((err, user) => {
				chai.request(server)
			    .post('/users/' + user.id + '/reminders')
			    .send(reminder)
			    .end((err, res) => {
			    	chai.request(server)
			    	.delete('/users/' + user.id + '/reminders/'  + res.body.id)
			    	.end((err,res)=>{
			    		res.should.have.status(204);
			      		done();
			    	});
			    });
		  });
	  });
  });

});






  