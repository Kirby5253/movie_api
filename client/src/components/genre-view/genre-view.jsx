import React from 'react';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import './genre-view.scss';

import { Link } from "react-router-dom";

export class GenreView extends React.Component {
	render() {
    const { genre } = this.props;

    
		return (
			<div className="genre-view">
				<div className="genre-name">
					<span className="label">Genre Name: </span>
					<span className="value">{genre.Name}</span>
				</div> <br />
				<div className="movie-description">
					<span className="label">Description: </span>
					<span className="value">{genre.Description}</span>
				</div>
				<br />
				<Link to={`/`}>
					<Button className="genre-button" variant="link">
						Home
					</Button>
				</Link>
			</div>
		);
	}
}

GenreView.propTypes = {
	genre: PropTypes.shape({
		Name: PropTypes.string.isRequired,
		Description: PropTypes.string.isRequired,
	})
};
