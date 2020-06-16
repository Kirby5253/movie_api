const express = require('express'),
	morgan = require('morgan'),
	bodyParser = require('body-parser');

const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

const app = express();

mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(morgan('common'));

app.use(bodyParser.json());

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

app.get('/movies', (req, res) => {
	Movies.find({}, function(err, data) {
		let titles = data.map((movie) => {
			return movie.Title;
		});
		res.json(titles);
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
		res.json(genreList);
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
	res.json(movieDirectors);
});

// Gets data on a specific director
app.get('/directors/:name', (req, res) => {
	res.json(
		directorList.find((director) => {
			return director.director_name === req.params.name;
		})
	);
});

// List of current users
let users = [
	{
		name: '',
		username: '',
		password: '',
		email: '',
		dob: ''
	}
];

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

// Create favorites array
let favorites = [];

// Allow users to add to favorites
app.post('/users/:Username/Movies/:MovieID', (req, res) => {
	Users.findOneAndUpdate(
		{ Username: req.params.Username },
		{
			$push: { FavoriteMovies: req.params.MovieID }
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

// Allow users to delete a movie from favorites
app.delete('/Account/favorites/:title', (req, res) => {
	let movie = movieArray.movies.find((movie) => {
		return movie.title === req.params.title;
	});

	if (movie) {
		res.status(201).send(movie.title + ' was removed from favorites.');
		favorites.pop(movie.title);
	} else {
		res.status(404).send('Movie with the name ' + req.params.title + ' was not found.');
	}
});

app.listen(8080, () => {
	console.log(`App is listening on port 8080.`);
});
