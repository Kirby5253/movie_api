const mongoose = require('mongoose');

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
	Password: { ype: String, required: true },
	Email: { type: String, required: true },
	Birthday: Date,
	FavoriteMovies: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' } ]
});

// Creates collections in the database
let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;
