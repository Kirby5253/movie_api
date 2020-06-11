const express = require('express'),
	morgan = require('morgan'),
	bodyParser = require('body-parser');

const app = express();

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
			name: 'Iron Man',
			description:
				'Dead men tell no tales Sea Legs nipperkin topgallant sheet wherry bring a spring upon her cable take a caulk black jack landlubber or just lubber. Nelsons folly Brethren of the Coast bilged on her anchor weigh anchor coffer interloper gibbet rutters piracy pressgang. Grog scurvy topsail gaff marooned sutler stern boom Jolly Roger rum. Brig loot cog fire in the hole strike colors boom grapple hearties Corsair bucko.',
			genres: [ 'action', 'superhero', 'war', 'adventure', 'science fiction' ],
			director: 'Jon Favreau',
			image: '#'
		},
		{
			name: 'Joker',
			description:
				'Dead men tell no tales Sea Legs nipperkin topgallant sheet wherry bring a spring upon her cable take a caulk black jack landlubber or just lubber. Nelsons folly Brethren of the Coast bilged on her anchor weigh anchor coffer interloper gibbet rutters piracy pressgang. Grog scurvy topsail gaff marooned sutler stern boom Jolly Roger rum. Brig loot cog fire in the hole strike colors boom grapple hearties Corsair bucko.',
			genres: [ 'crime', 'drama', 'thriller' ],
			director: 'Todd Phillips',
			image: '#'
		},
		{
			name: '1917',
			description:
				'Dead men tell no tales Sea Legs nipperkin topgallant sheet wherry bring a spring upon her cable take a caulk black jack landlubber or just lubber. Nelsons folly Brethren of the Coast bilged on her anchor weigh anchor coffer interloper gibbet rutters piracy pressgang. Grog scurvy topsail gaff marooned sutler stern boom Jolly Roger rum. Brig loot cog fire in the hole strike colors boom grapple hearties Corsair bucko.',
			genres: [ 'war', 'drama' ],
			director: 'Sam Mendes',
			image: '#'
		}
	]
};

var movieTitleArray = [];
var movieGenres = [];
var movieDirectors = [];

// Pulls out only the title of the available movies
let movieTitles = movieArray['movies'];
for (let i = 0; i < movieTitles.length; i++) {
	movieTitleArray.push(movieTitles[i].name);
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
	{ director_name: 'Jon Favreau', movies_directed: 'Iron Man', birthday: 'October 19, 1996' },
	{ director_name: 'Todd Phillips', movies_directed: 'Joker', birthday: 'December 20, 1970' },
	{ director_name: 'Sam Mendes', movies_directed: '1917', birthday: 'August 1, 1965' }
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
app.get('/movies/:name', (req, res) => {
	res.json(
		movieArray.movies.find((movie) => {
			return movie.name == req.params.name;
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

// Adds data for a new user
app.post('/Account', (req, res) => {
	let newUser = req.body;

	if (!newUser.name) {
		const message = 'Missing info in request body';
		res.status(400).send(message);
	} else {
		users.push(newUser);
		res.status(201).send(newUser);
	}
});

// Allows details to be viewed of a user by email
app.get('/Account/:username', (req, res) => {
	res.json(
		users.find((user) => {
			return user.username === req.params.username;
		})
	);
});

// Allow users to update their account info
app.put('/Account/:username/edit', (req, res) => {
	let user = users.find((user) => {
		return user.username === req.params.username;
	});

	if (user) {
		res.status(201).send('User information was updated: ' + user);
	} else {
		res.status(404).send('User with the name ' + req.params.name + ' was not found.');
	}
});

// Allow users to delete their account
app.delete('/Account/:username', (req, res) => {
	let user = users.find((user) => {
		return user.username === req.params.username;
	});

	if (user) {
		users = users.filter((obj) => {
			return obj.username !== req.params.username;
		});
		res.status(201).send('User ' + user.name + ' was deleted.');
	}
});

// Create favorites array
let favorites = [];

// Allow users to add to favorites
app.post('/movies/favorites/:name', (req, res) => {
	let movie = movieArray.movies.find((movie) => {
		return movie.name === req.params.name;
	});

	if (movie) {
		res.status(201).send(movie.name + ' was added to favorites!');
		favorites.push(movie.name);
	} else {
		res.status(404).send('Movie with the name ' + req.params.name + ' was not found.');
	}
});

// Allow users to delete a movie from favorites
app.delete('/movies/favorites/:name', (req, res) => {
	let movie = movieArray.movies.find((movie) => {
		return movie.name === req.params.name;
	});

	if (movie) {
		res.status(201).send(movie.name + ' was removed from favorites.');
		favorites.pop(movie.name);
	} else {
		res.status(404).send('Movie with the name ' + req.params.name + ' was not found.');
	}
});

app.listen(8080, () => {
	console.log(`App is listening on port 8080.`);
});
