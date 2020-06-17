const express = require('express'),
	morgan = require('morgan'),
	bodyParser = require('body-parser');

const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

const passport = require('passport');
require('./passport');

const app = express();

mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(morgan('common'));

app.use(bodyParser.json());

let auth = require('./auth')(app);

app.use(express.static('public'));

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send('Something broke!');
});

// Welcome page for API
app.get('/', (req, res) => {
	res.status(200).send('Welcome to myFlix!');
});

// Returns a list of all available movies

app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
	Movies.find({}, function(err, data) {
		let titles = data.map((movie) => {
			return movie.Title;
		});
		if (err) {
			console.error(err);
			res.status(500).send('Error: ' + err);
		} else {
			res.json(titles);
		}
	});
});

// Returns data on a specific movie
app.get('/movies/:Title', (req, res) => {
	Movies.findOne({ Title: req.params.Title })
		.then((movie) => {
			res.json(movie);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send('Error: ' + err);
		});
});

// Returns a list of unique genres
app.get('/genres', (req, res) => {
	Movies.find({}, function(err, data) {
		let genres = data.map((movie) => {
			return movie.Genre.Name;
		});
		let set = new Set(genres);
		let genreList = [ ...set ];
		if (err) {
			console.error(err);
			res.status(500).send('Error: ' + err);
		} else {
			res.json(genreList);
		}
	});
});

// Gets info on a specific genre
app.get('/genres/:Name', (req, res) => {
	Movies.findOne({ 'Genre.Name': req.params.Name })
		.then((movie) => {
			res.json(movie.Genre);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send('Error: ' + err);
		});
});

// Gets a list of all available directors
app.get('/directors', (req, res) => {
	Movies.find({}, function(err, data) {
		let directors = data.map((movie) => {
			return movie.Director.Name;
		});
		let set = new Set(directors);
		let directorList = [ ...set ];
		res.json(directorList);
	});
});

// Gets data on a specific director
app.get('/directors/:Name', (req, res) => {
	Movies.findOne({ 'Director.Name': req.params.Name })
		.then((movie) => {
			res.json(movie.Director);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send('Error: ' + err);
		});
});

//Add a user
/* We’ll expect JSON in this format
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/
app.post('/users', (req, res) => {
	Users.findOne({ Username: req.body.Username })
		.then((user) => {
			if (user) {
				return res.status(400).send(req.body.Username + ' already exists');
			} else {
				Users.create({
					Username: req.body.Username,
					Password: req.body.Password,
					Email: req.body.Email,
					Birthday: req.body.Birthday
				})
					.then((user) => {
						res.status(201).json(user);
					})
					.catch((error) => {
						console.error(error);
						res.status(500).send('Error: ' + error);
					});
			}
		})
		.catch((error) => {
			console.error(error);
			res.status(500).send('Error: ' + error);
		});
});

// Get all users
app.get('/users', (req, res) => {
	Users.find()
		.then((users) => {
			res.status(201).json(users);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).semd('Error: ' + err);
		});
});

// Allows details to be viewed of a user by username
app.get('/users/:Username', (req, res) => {
	Users.findOne({ Username: req.params.Username })
		.then((user) => {
			res.json(user);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send('Error: ' + err);
		});
});

// Update a user's info, by username
/* We’ll expect JSON in this format
{
  Username: String,
  (required)
  Password: String,
  (required)
  Email: String,
  (required)
  Birthday: Date
}*/
app.put('/users/:Username', (req, res) => {
	Users.findOneAndUpdate(
		{ Username: req.params.Username },
		{
			$set: {
				Username: req.body.Username,
				Password: req.body.Password,
				Email: req.body.Email,
				Birth_Date: req.body.Birth_Date
			}
		},
		{ new: true }, //This line makes sure that the updated document is returned
		(err, updatedUser) => {
			if (err) {
				console.error(err);
				res.status(500).send('Error: ' + err);
			} else {
				res.json(updatedUser);
			}
		}
	);
});

// Allow users to delete their account
app.delete('/users/:Username', (req, res) => {
	Users.findOneAndRemove({ Username: req.params.Username })
		.then((user) => {
			if (!user) {
				res.status(400).send(req.params.Username + ' was not found');
			} else {
				res.status(200).send(req.params.Username + ' was deleted.');
			}
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send('Error: ' + err);
		});
});

// Allow users to add to favorites
app.post('/users/:Username/Movies/:MovieID', (req, res) => {
	Users.findOneAndUpdate(
		{ Username: req.params.Username },
		{
			$push: { Favorite_Movies: req.params.MovieID }
		},
		{ new: true }, // This line makes sure that the updated document is returned
		(err, updatedUser) => {
			if (err) {
				console.error(err);
				res.status(500).send('Error: ' + err);
			} else {
				res.json(updatedUser);
			}
		}
	);
});

// Allow users to remove a movie from favorites
app.put('/users/:Username/Movies/:MovieID', (req, res) => {
	Users.findOneAndUpdate(
		{ Username: req.params.Username },
		{
			$pull: { Favorite_Movies: req.params.MovieID }
		},
		{ new: true }, // This line makes sure that the updated document is returned
		(err, updatedUser) => {
			if (err) {
				console.error(err);
				res.status(500).send('Error: ' + err);
			} else {
				res.json(updatedUser);
			}
		}
	);
});

app.listen(8080, () => {
	console.log(`App is listening on port 8080.`);
});
