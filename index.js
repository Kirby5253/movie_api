const express = require('express');
const morgan = require('morgan');
const app = express();

let movies = [
	{
		name: 'Iron Man',
		description:
			'Dead men tell no tales Sea Legs nipperkin topgallant sheet wherry bring a spring upon her cable take a caulk black jack landlubber or just lubber. Nelsons folly Brethren of the Coast bilged on her anchor weigh anchor coffer interloper gibbet rutters piracy pressgang. Grog scurvy topsail gaff marooned sutler stern boom Jolly Roger rum. Brig loot cog fire in the hole strike colors boom grapple hearties Corsair bucko.',
		genre: [ 'action', 'superhero', 'war', 'adventure', 'science fiction' ],
		director: 'Jon Favreau',
		image: '#'
	},
	{
		name: 'Joker',
		description:
			'Dead men tell no tales Sea Legs nipperkin topgallant sheet wherry bring a spring upon her cable take a caulk black jack landlubber or just lubber. Nelsons folly Brethren of the Coast bilged on her anchor weigh anchor coffer interloper gibbet rutters piracy pressgang. Grog scurvy topsail gaff marooned sutler stern boom Jolly Roger rum. Brig loot cog fire in the hole strike colors boom grapple hearties Corsair bucko.',
		genre: [ 'crime', 'drama', 'thriller' ],
		director: 'Todd Phillips',
		image: '#'
	},
	{
		name: '1917',
		description:
			'Dead men tell no tales Sea Legs nipperkin topgallant sheet wherry bring a spring upon her cable take a caulk black jack landlubber or just lubber. Nelsons folly Brethren of the Coast bilged on her anchor weigh anchor coffer interloper gibbet rutters piracy pressgang. Grog scurvy topsail gaff marooned sutler stern boom Jolly Roger rum. Brig loot cog fire in the hole strike colors boom grapple hearties Corsair bucko.',
		genre: [ 'war', 'drama' ],
		director: 'Sam Mendes',
		image: '#'
	}
];

app.use(morgan('common'));

app.use(express.static('public'));

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send('Something broke!');
});

app.get('/', (req, res) => {
	res.send('Welcome to myFlix!');
});

app.get('/movies', (req, res) => {
	res.json(list_of_movies.json);
});

app.listen(5000, () => {
	console.log(`App is listening on port 5000.`);
});
