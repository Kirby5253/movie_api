const express = require('express'),
	morgan = require('morgan'),
	bodyParser = require('body-parser');

const mongoose = require('mongoose');
const Models = require('./models.js');

const cors = require('cors');

const Movies = Models.Movie;
const Users = Models.User;

const passport = require('passport');
require('./passport');
require('dotenv').config()

const app = express();

const { check, validationResult } = require('express-validator');

const path = require('path');

/*mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });*/

mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(morgan('dev'));

app.use(bodyParser.json());

let allowedOrigins = [ '*', 'http://localhost:8080', 'https://myflixdb5253.herokuapp.com/client/' ];

app.use(
	cors({
		origin: (origin, callback) => {
			if (!origin) return callback(null, true);
			if (allowedOrigins.indexOf(origin) === -1) {
				// If a specific origin isn’t found on the list of allowed origins
				let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
				return callback(new Error(message), false);
			}
			return callback(null, true);
		}
	})
);

let auth = require('./auth')(app);

app.use(express.static('public'));

app.use('/client', express.static(path.join(__dirname, 'client', 'dist')));

app.use('/log', express.static(path.join(__dirname, 'log.txt')));

app.get('/client/*', (req, res) => {
	res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send('Something broke!', JSON.stringify(err));
});

// Welcome page for API
app.get('/', (req, res) => {
	res.status(200).send('Welcome to myFlix!');
});

// Returns a list of all available movies

app.get('/movies', (req, res) => {
	Movies.find({}, function(err, data) {
		if (err) {
			console.error(err);
			res.status(500).send('Error: ' + err);
		} else {
			res.json(data);
		}
	});
});

// Returns data on a specific movie
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
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
app.get('/genres', passport.authenticate('jwt', { session: false }), (req, res) => {
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
app.get('/genres/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
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
app.get('/directors', passport.authenticate('jwt', { session: false }), (req, res) => {
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
app.get('/directors/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
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
  Username: String, at least 5 chars, only letters and numbers
  Password: String,
  Email: String,
  Birthday: Date (YYYY-MM-DD)
}*/
app.post(
	'/users',
	[
		check('Username', 'Username is required').isLength({ min: 5 }),
		check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
		check('Password', 'Password is required').not().isEmpty(),
		check('Email', 'Email does not appear to be valid').isEmail()
	],
	(req, res) => {
		// check the validation object for errors
		let errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

		let hashedPassword = Users.hashPassword(req.body.Password);
		Users.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists
			.then((user) => {
				if (user) {
					return res.status(400).send(req.body.Username + ' already exists');
				} else {
					Users.create({
						Username: req.body.Username,
						Password: hashedPassword,
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
	}
);

app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
	Users.find()
		.then((users) => {
			res.status(201).json(users);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send('Error: ' + err);
		});
});

// Allows details to be viewed of a user by username
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
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
app.put(
	'/users/:Username',
	[
		check('Username', 'Username is required').isLength({ min: 5 }),
		check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
		check('Password', 'Password is required').not().isEmpty(),
		check('Email', 'Email does not appear to be valid').isEmail()
	],
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		let hashedPassword = Users.hashPassword(req.body.Password);
		Users.findOneAndUpdate(
			{ Username: req.params.Username },
			{
				$set: {
					Username: req.body.Username,
					Password: hashedPassword,
					Email: req.body.Email,
					Birthday: req.body.Birthday
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
	}
);

// Allow users to delete their account
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
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
app.post('/users/:Username/Movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
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
app.put('/users/:Username/Movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
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

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
	console.log('Listening on Port ' + port);
});
