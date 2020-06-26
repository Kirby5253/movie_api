import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import axios from 'axios';

export function RegistrationView(props) {
	const user = localStorage.getItem('user');
	const [ newUsername, setNewUsername ] = useState('');
	const [ newPassword, setNewPassword ] = useState('');
	const [ newEmail, setNewEmail ] = useState('');
	const [ newBirthDate, setNewBirthDate ] = useState('');

	if (user) return null;

	const handleRegistrationSubmit = (e) => {
		e.preventDefault();
		/* Send a request to the server for authentication */
		axios
			.post('https://myflixdb5253.herokuapp.com/users', {
				Username: newUsername,
				Password: newPassword,
				Email: newEmail,
				Birthday: newBirthDate
			})
			.then((response) => {
				const data = response.data;
				console.log(data);
				window.open('/client', '_self'); // Self to open in the current window
				alert(
					'User ' +
						newUsername +
						' was successfully created. Please login with your new username and password.'
				);
			})
			.catch((e) => {
				console.log('error registering the user');
			});
	};

	const cancelRegistration = () => {
		window.open('/client', '_self');
	};

	return (
		<div className="login-form">
			<Form className="register-form">
				<Form.Label>
					<h3>Create New User for MyFlix</h3>
				</Form.Label>

				<Form.Group controlId="formBasicUsername">
					<Form.Label>Create Username:</Form.Label>
					<Form.Control
						type="text"
						placeholder="Username"
						value={newUsername}
						onChange={(e) => setNewUsername(e.target.value)}
						required
					/>
				</Form.Group>

				<Form.Group controlId="formBasicPassword">
					<Form.Label>Create Password</Form.Label>
					<Form.Control
						type="password"
						placeholder="Password"
						value={newPassword}
						onChange={(e) => setNewPassword(e.target.value)}
						required
					/>
				</Form.Group>

				<Form.Group controlId="formBasicPassword">
					<Form.Label>Email</Form.Label>
					<Form.Control
						type="email"
						placeholder="Email"
						value={newEmail}
						onChange={(e) => setNewEmail(e.target.value)}
					/>
				</Form.Group>

				<Form.Group controlId="formBasicPassword">
					<Form.Label>Date of Birth</Form.Label>
					<Form.Control
						type="text"
						placeholder="YYYY-MM-DD"
						value={newBirthDate}
						onChange={(e) => setNewBirthDate(e.target.value)}
					/>
				</Form.Group>

				<Button variant="dark" type="button" onClick={handleRegistrationSubmit}>
					Register
				</Button>
				<Button variant="link" type="button" onClick={cancelRegistration}>
					Already a user? Click here to sign in.
				</Button>
			</Form>
		</div>
	);
}

RegistrationView.propTypes = {
	setNewUsername: PropTypes.string,
	setNewPassword: PropTypes.string
};
