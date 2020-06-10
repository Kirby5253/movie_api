const express = require('express');
const morgan = require('morgan');
const app = express();

let movies = [
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
];

var movie_list = [];

let movie_info = movies.forEach((element) => {
	var movie_details = {
		name: element.name,
		desc: element.description,
		genres: element.genres,
		director: element.director,
		image: element.image
	};
	movie_list.push(element);
});

let genre_list = [ movie_list.genres ];

app.use(morgan('common'));

app.use(express.static('public'));

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send('Something broke!');
});

app.get('/', (req, res) => {
	res.status(200).send('Welcome to myFlix!');
});

app.get('/movies', (req, res) => {
	res.status(200).json(movie_list);
});

app.get('/movies/:name', (req, res) => {
	res.json(
		movies.find((movie) => {
			return movie.name == req.params.name;
		})
	);
});

app.get('/genres', (req, res) => {
	res.json(genre_list);
});

app.listen(8080, () => {
	console.log(`App is listening on port 8080.`);
});
