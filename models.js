const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Defines the schema for the movies database
let movieSchema = mongoose.Schema({
	Title: { type: String, required: true },
	Description: { type: String, required: true },
	Genre: {
		Name: String,
		Description: String
	},
	Director: {
		Name: String,
		Bio: String
	},
	Actors: [ String ],
	ImagePath: String,
	Featured: Boolean
});

// Defines the schema for the users database
let userSchema = mongoose.Schema({
	Username: { type: String, required: true },
	Password: { type: String, required: true },
	Email: { type: String, required: true },
	Birthday: Date,
	Favorite_Movies: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' } ]
});

userSchema.statics.hashPassword = (password) => {
	return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function(password) {
	return bcrypt.compareSync(password, this.Password);
};

// Creates collections in the database
let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;
