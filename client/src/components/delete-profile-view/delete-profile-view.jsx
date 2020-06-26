import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import './delete-profile-view.scss';
import axios from 'axios';
import { Link } from 'react-router-dom';

export class DeleteProfile extends React.Component {
	render() {
		const { user, onDelete } = this.props;
		const token = localStorage.getItem('token');
		console.log(token);

		const handleDelete = (e) => {
			axios
				.delete(`https://myflixdb5253.herokuapp.com/users/${user.Username}`, {
					headers: { Authorization: `Bearer ${token}` }
				})
				.then((response) => {
					const data = response.data;
					location.reload();
					console.log(data);
					onDelete();
				})
				.catch((e) => {
					console.log('no such user');
				});
		};

		return (
			<div className="delete-profile">
				<h1>Are you sure you want to delete this profile?</h1>
				<ul>
					<li>
						<Link to={`/register`}>
							<Button onClick={handleDelete} className="delete-buttons" variant="danger">
								Yes, delete my account.
							</Button>
						</Link>
					</li>
					<li>
						<Link to={`/profile/${user.Username}`}>
							<Button className="delete-buttons">No, do not delete my account.</Button>
						</Link>
					</li>
				</ul>
			</div>
		);
	}
}
