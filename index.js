const express = require('express'),
	morgan = require('morgan'),
	bodyParser = require('body-parser');

const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

const app = express();

mongoose.connect('mongodb://localhost:27017/myFlixDbB', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(morgan('common'));

app.use(bodyParser.json());

app.use(express.static('public'));

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send('Something broke!');
});

let movieArray = {
	movies: [
		{
			title: 'Iron Man',
			description:
				'Dead men tell no tales Sea Legs nipperkin topgallant sheet wherry bring a spring upon her cable take a caulk black jack landlubber or just lubber. Nelsons folly Brethren of the Coast bilged on her anchor weigh anchor coffer interloper gibbet rutters piracy pressgang. Grog scurvy topsail gaff marooned sutler stern boom Jolly Roger rum. Brig loot cog fire in the hole strike colors boom grapple hearties Corsair bucko.',
			genres: {
				name: 'Science Fiction',
				description: 'A movie that exploits science that is not accepted by mainstream articles'
			},
			director: {
				name: 'Jon Favreau',
				bio: 'American actor, director, producer',
				birth: '1965'
			},
			image: '#',
			actors: [ 'Robert Downey Jr', 'Jon Favreau', 'Gwyneth Paltrow' ]
		},
		{
			title: 'Joker',
			description:
				'Dead men tell no tales Sea Legs nipperkin topgallant sheet wherry bring a spring upon her cable take a caulk black jack landlubber or just lubber. Nelsons folly Brethren of the Coast bilged on her anchor weigh anchor coffer interloper gibbet rutters piracy pressgang. Grog scurvy topsail gaff marooned sutler stern boom Jolly Roger rum. Brig loot cog fire in the hole strike colors boom grapple hearties Corsair bucko.',
			genre: {
				name: 'crime',
				description: 'people who are bad'
			},
			director: {
				name: 'Todd Phillips',
				bio: 'American director',
				birth: '1960'
			},
			image: '#',
			actors: [ 'Jaoquin Phoenix', 'Robert DeNiro' ]
		},
		{
			title: '1917',
			description:
				'Dead men tell no tales Sea Legs nipperkin topgallant sheet wherry bring a spring upon her cable take a caulk black jack landlubber or just lubber. Nelsons folly Brethren of the Coast bilged on her anchor weigh anchor coffer interloper gibbet rutters piracy pressgang. Grog scurvy topsail gaff marooned sutler stern boom Jolly Roger rum. Brig loot cog fire in the hole strike colors boom grapple hearties Corsair bucko.',
			genre: {
				name: 'war',
				description: 'humans fighting'
			},
			director: {
				name: 'Sam Mendes',
				bio: 'American director.',
				birth: '1965'
			},
			image: '#',
			actors: [ 'George MacKay', 'Richard Madden' ]
		}
	]
};

var movieTitleArray = [];
var movieGenres = [];
var movieDirectors = [];

// Pulls out only the title of the available movies
let movieTitles = movieArray['movies'];
for (let i = 0; i < movieTitles.length; i++) {
	movieTitleArray.push(movieTitles[i].title);
}

for (let i = 0; i < movieTitles.length; i++) {
	movieDirectors.push(movieTitles[i].director);
}

// List of unique genres and descriptions
let genreList = [
	{
		genre_name: 'war',
		desc: 'humans fighting'
	},
	{
		genre_name: 'drama',
		desc: 'people who are sad'
	},
	{
		genre_name: 'thriller',
		desc: 'scary stuff'
	},
	{
		genre_name: 'crime',
		desc: 'people who are bad'
	},
	{
		genre_name: 'action',
		desc: 'people doing exciting things'
	},
	{
		genre_name: 'superhero',
		desc: 'good people'
	},
	{
		genre_name: 'adventure',
		desc: 'people who do things and go places'
	},
	{
		genre_name: 'science fiction',
		desc: 'science experiments gone wrong'
	}
];

for (let i = 0; i < genreList.length; i++) {
	if (movieGenres.indexOf(genreList[i]['genre_name']) === -1) {
		movieGenres.push(genreList[i]['genre_name']);
	}
}

// List of unique director details
let directorList = [
	{
		director_name: 'Jon Favreau',
		movies_directed: 'Iron Man',
		birth_date: 'October 19, 1996',
		bio: 'American director'
	},
	{
		director_name: 'Todd Phillips',
		movies_directed: 'Joker',
		birth_date: 'December 20, 1970',
		bio: 'American director'
	},
	{
		director_name: 'Sam Mendes',
		movies_directed: '1917',
		birth_date: 'August 1, 1965',
		bio: 'American Director'
	}
];

// Welcome page for API
app.get('/', (req, res) => {
	res.status(200).send('Welcome to myFlix!');
});

// Returns a list of all available movies
app.get('/movies', (req, res) => {
	res.status(200).json(movieTitleArray);
});

// Returns data on a specific movie
app.get('/movies/:title', (req, res) => {
	res.json(
		movieArray.movies.find((movie) => {
			return movie.title == req.params.title;
		})
	);
});

// Gets a list of all genres available
app.get('/genres', (req, res) => {
	res.json(movieGenres);
});

// Gets info on a specific genre
app.get('/genres/:name', (req, res) => {
	res.json(
		genreList.find((genre) => {
			return genre.genre_name === req.params.name;
		})
	);
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
