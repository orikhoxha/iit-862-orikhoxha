process.env.NODE_ENV = 'test';
let mongoose = require("mongoose");
let User = require('../models/user');
let Reminder = require('../models/reminder');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

describe('Users', () => {
	
  /*
  * Test the /GET/:id route
  */
 describe('/GET/:id user', () => {



 	  it('it should not GET a user without id', (done) => {
	  	let user = new User({name:"Orik Hoxha", email:"orikhoxha@gmail.com"});
	  	user.save((err, user) => {
	  		chai.request(server)
		    .get('/users')
		    .end((err, res) => {
			  	res.should.have.status(404);
		      done();
		    });
	  	});	
	  });


	  it('it should GET a user by the given id', (done) => {
	  	let user = new User({name:"Orik Hoxha", email:"orikhoxha@gmail.com"});
	  	user.save((err, user) => {
	  		chai.request(server)
		    .get('/users/' + user.id)
		    .send(user)
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.be.a('object');
			  	res.body.should.have.property('name');
			  	res.body.should.have.property('email');
		      done();
		    });
	  	});	
	  });
  });

  describe('/POST user', () => {

  	 it('it should not POST a user without email field', (done) => {
	  	let user = {
	  		name: "Orik"
	  	}
		chai.request(server)
	    .post('/users')
	    .send(user)
	    .end((err, res) => {
		  	res.should.have.status(500);
		  	res.body.should.be.a('object');
		  	res.body.should.have.property('errors');
		  	res.body.errors.should.have.property('email');
	      done();
	    });
	  });

	 
	  it('it should POST a user ', (done) => {
	  	let user = {
	  		name: "Orik Hoxha",
	  		email: "ohoxha@hawk.iit.edu"
	  	}
		chai.request(server)
	    .post('/users')
	    .send(user)
	    .end((err, res) => {
		  	res.should.have.status(200);
		  	res.body.should.be.a('object');
		  	res.body.should.have.property('id');
	      done();
	    });
	  });
  });

  describe('/delete/:id user', () => {


  	  it('it should not delete a user without id', (done) => {
	  	let user = new User({name:"Orik Hoxha", email:"orikhoxha@gmail.com"});
	  	user.save((err, user) => {
	  		chai.request(server)
		    .delete('/users')
		    .end((err, res) => {
			  	res.should.have.status(404);
		      done();
		    });
	  	});	
	  });

	  it('it should delete a user given the id', (done) => {
	  	let user = new User({name: "Orik", email: "orikhoxha@gmail.com"})
	  	user.save((err, user) => {
				chai.request(server)
			    .delete('/users/' + user.id)
			    .end((err, res) => {
				  	res.should.have.status(204);
			      done();
			    });
		  });
	  });
  });
});