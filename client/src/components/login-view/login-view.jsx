import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { Link } from 'react-router-dom';

export function LoginView(props) {
	const [ username, setUsername ] = useState('');
	const [ password, setPassword ] = useState('');

	// Has ability to login with random credentials for existing user, no functionality for new users yet
	const handleSubmit = (e) => {
		e.preventDefault();
		/* Send a request to the server for authentication */
		axios
			.post('https://myflixdb5253.herokuapp.com/login', {
				Username: username,
				Password: password
			})
			.then((response) => {
				const data = response.data;
				props.onLoggedIn(data);
			})
			.catch((e) => {
				console.log('no such user');
			});
	};

	// Allows user to push enter instead of clicking login
	const handleSubmitEnter = (e) => {
		if (event.key === 'Enter') {
			/* Send a request to the server for authentication */
			axios
				.post('https://myflixdb5253.herokuapp.com/login', {
					Username: username,
					Password: password
				})
				.then((response) => {
					const data = response.data;
					props.onLoggedIn(data);
				})
				.catch((e) => {
					console.log('no such user');
				});
		}
	};

	return (
		<div className="login-form">
			<Form className>
				<Form.Label>
					<h3 className="login-title">Login to MyFlix</h3>
				</Form.Label>
				<Form.Group controlId="formBasicUsername">
					<Form.Label>Username:</Form.Label>
					<Form.Control
						type="text"
						placeholder="Username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
					/>
				</Form.Group>

				<Form.Group controlId="formBasicPassword">
					<Form.Label>Password</Form.Label>
					<Form.Control
						onKeyPress={handleSubmitEnter}
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</Form.Group>
				<br />
				<Button variant="dark" className="login-button" type="button" onClick={handleSubmit}>
					Login
				</Button>
				<Link to={`/register`}>
					<Button variant="link" className="login-button" type="button">
						New to MyFlix? Click here to create an account
					</Button>
				</Link>
				<br />
			</Form>
		</div>
	);
}

LoginView.propTypes = {
	setUsername: PropTypes.string,
	setPassword: PropTypes.string
};
