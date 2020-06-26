import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import axios from 'axios';
import './change-profile-view.scss';
import { Link } from 'react-router-dom';

export function ChangeProfile(props) {
	const [ newUsername, setNewUsername ] = useState('');
	const [ newPassword, setNewPassword ] = useState('');
	const [ newEmail, setNewEmail ] = useState('');
	const [ newBirthDate, setNewBirthDate ] = useState('');
	const storedUser = localStorage.getItem('user');
	const token = localStorage.getItem('token');

	if (!storedUser) return null;

	const handleProfileUpdate = (e) => {
		e.preventDefault();
		/* Send a request to the server for authentication */
		axios
			.put(
				`https://myflixdb5253.herokuapp.com/users/${storedUser}`,
				{
					Username: newUsername,
					Password: newPassword,
					Email: newEmail,
					Birthday: newBirthDate
				},
				{
					headers: { Authorization: `Bearer ${token}` }
				}
			)
			.then((response) => {
				const data = response.data;
				console.log(data);
				alert('User info was successfully updated!');
				window.open(`/client/profile/${newUsername}`, '_self'); // Self to open in the current window
				localStorage.setItem('user', newUsername);
			})
			.catch((e) => {
				alert('Error: User info was not updated. Please try again.');
				console.log('error updating the user');
				console.log(e);
			});
	};

	return (
		<div className="update-form">
			<Form className="change-form">
				<Form.Label>
					<h3>
						Update User Info<br /> (All fields are required)
					</h3>
				</Form.Label>

				<Form.Group controlId="formBasicUsername">
					<Form.Label>New Username:</Form.Label>
					<Form.Control
						type="text"
						placeholder="Username"
						value={newUsername}
						onChange={(e) => setNewUsername(e.target.value)}
						required
					/>
				</Form.Group>

				<Form.Group controlId="formBasicPassword">
					<Form.Label>New Password:</Form.Label>
					<Form.Control
						type="password"
						placeholder="Password"
						value={newPassword}
						onChange={(e) => setNewPassword(e.target.value)}
						required
					/>
				</Form.Group>

				<Form.Group controlId="formBasicPassword">
					<Form.Label>New Email</Form.Label>
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

				<Button onClick={handleProfileUpdate} variant="primary" type="button">
					Update Account
				</Button>
				<Link to={`/profile/${storedUser}`}>
					<Button variant="link">Cancel Update</Button>
				</Link>
			</Form>
		</div>
	);
}
