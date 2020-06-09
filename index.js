const express = require('express');
const morgan = require('morgan');
const app = express();

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
	res.json(top10);
});

app.listen(5000, () => {
	console.log(`App is listening on port 5000.`);
});
