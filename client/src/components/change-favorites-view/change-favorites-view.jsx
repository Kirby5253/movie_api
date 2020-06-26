import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import './change-favorites.scss';
import axios from 'axios';
import { Link } from 'react-router-dom';

export function ChangeFavorites() {
	const [ favoriteId, confirmFavoriteId ] = useState('');
	const storedUser = localStorage.getItem('user');
	const token = localStorage.getItem('token');

	const handleRemoveFavorite = (e) => {
		axios
			.put(
				`https://myflixdb5253.herokuapp.com/users/${storedUser}/Movies/${favoriteId}`,
				{
					headers: { Authorization: `Bearer ${token}` }
				},
				{
					headers: { Authorization: `Bearer ${token}` }
				}
			)
			.then((response) => {
				const data = response.data;
				console.log(data);
				alert(favoriteId + ' has been removed from favorites.');
				location.reload();
			})
			.catch((e) => {
				console.log(e);
				alert('Please input a valid Movie ID.');
			});
	};

	return (
		<div className="remove-favorite">
			<h1 />
			<Form className="delete-fav">
				<Form.Group controlId="formRemoveFav">
					<Form.Label>Input the ID of the movies you wish to remove from favorites</Form.Label>
					<Form.Control
						type="text"
						placeholder="Movie ID"
						value={favoriteId}
						onChange={(e) => confirmFavoriteId(e.target.value)}
						required
					/>
				</Form.Group>
				<Button onClick={handleRemoveFavorite} variant="primary" type="button">
					Update Favorites
				</Button>
				<Link to={`/profile/${storedUser}`}>
					<Button variant="link">Cancel Update</Button>
				</Link>
			</Form>
		</div>
	);
}
