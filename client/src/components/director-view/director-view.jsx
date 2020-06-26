import React from 'react';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import './director-view.scss';

import { Link } from "react-router-dom";

export class DirectorView extends React.Component {
	constructor() {
		super();

		this.state = {};
	}

	render() {
    const { director } = this.props;

		return (
			<div className="director-view">
				<div className="director-name">
					<span className="label">Director Name: </span>
					<span className="value">{director.Name}</span>
				</div>
        <br />
				<div className="director-bio">
					<span className="label">Biography: </span>
					<span className="value">{director.Bio}</span>
				</div>
        <br />
        <div className="director-birth">
					<span className="label">Born: </span>
					<span className="value">{director.Birth}</span>
				</div>
				<br />
				<Link to={`/`} className="home-button">
					<Button variant="link">
						Home
					</Button>
				</Link>
			</div>
		);
	}
}
