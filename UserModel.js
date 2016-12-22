var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var crypto = require('crypto');

var UserSchema = new mongoose.Schema({
  username: String,
  hash: String
});

UserSchema.methods.generateJWT = function() {
	// set expiration to 60 days
	 var today = new Date();
	 var exp = new Date(today);
	 exp.setDate(today.getDate() + 60);

	 return jwt.sign({
	   _id: this._id,
	   username: this.username,
	   exp: parseInt(exp.getTime() / 1000),
	 }, 'SECRET');	
};

UserSchema.methods.setPassword = function(password){
	var hash = crypto.createHash('md5');

	hash.update(password, 'utf8');
	this.hash = hash.digest('hex');
};

UserSchema.methods.validPassword = function(password) {
  	var hash = crypto.createHash('md5');

  	hash.update(password, 'utf8');
  	var testedHash = hash.digest('hex');
  	return (this.hash === testedHash);	
};

var User = mongoose.model('User', UserSchema);

module.exports = User;