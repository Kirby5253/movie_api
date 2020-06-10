const express = require('express'),
	morgan = require('morgan'),
	bodyParser = require('body-parser'),
	uuid = require('uuid');

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
	if (movieGenres.indexOf(movieTitles[i]['genres']) === -1) {
		movieGenres.push(movieTitles[i]['genres']);
	}
}

for (let i = 0; i < movieTitles.length; i++) {
	movieDirectors.push(movieTitles[i].director);
}

// List of unique genres and descriptions
let genreList = [
	{
		name: 'war',
		desc: 'humans fighting'
	},
	{
		name: 'drama',
		desc: 'people who are sad'
	},
	{
		name: 'thriller',
		desc: 'scary stuff'
	},
	{
		name: 'crime',
		desc: 'people who are bad'
	},
	{
		name: 'action',
		desc: 'people doing exciting things'
	},
	{
		name: 'superhero',
		desc: 'good people'
	},
	{
		name: 'adventure',
		desc: 'people who do things and go places'
	},
	{
		name: 'science fiction',
		desc: 'science experiments gone wrong'
	}
];

// List of unique director details
let directorList = [
	{ director_name: 'Jon Favreau', movies_directed: 'Iron Man' },
	{ director_name: 'Todd Phillips', movies_directed: 'Joker' },
	{ director_name: 'Sam Mendes', movies_directed: '1917' }
];

// List of current users
let users = [];

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

app.get('/genres', (req, res) => {
	res.json(movieGenres);
});

app.get('/genres/:name', (req, res) => {
	res.json(
		genreList.find((genre) => {
			return genre.name === req.params.name;
		})
	);
});

app.get('/directors', (req, res) => {
	res.json(movieDirectors);
});

app.get('/directors/:name', (req, res) => {
	res.json(
		directorList.find((director) => {
			return director.director_name === req.params.name;
		})
	);
});

// Adds data for a new user
app.post('/Account', (req, res) => {
	let newUser = req.body;

	if (!newUser.name || !newUser.userName || !newUser.password) {
		const message = 'Missing info in request body';
		res.status(400).send(message);
	} else {
		newUser.id = uuid.v4();
		users.push(newUser);
		res.status(201).send(newUser);
	}
});

app.listen(8080, () => {
	console.log(`App is listening on port 8080.`);
});
