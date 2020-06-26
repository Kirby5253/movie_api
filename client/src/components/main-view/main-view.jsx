import React from 'react';
import axios from 'axios';
import './main-view.scss';
import { Nav, Navbar, Container } from 'react-bootstrap';

import { connect } from 'react-redux';

import { BrowserRouter as Router, Route } from 'react-router-dom';

import { setMovies } from '../../actions/actions';

import MoviesList from '../movies-list/movies-list';
import { LoginView } from '../login-view/login-view';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import { RegistrationView } from '../registration-view/registration-view';
import { GenreView } from '../genre-view/genre-view';
import { DirectorView } from '../director-view/director-view';
import { ProfileView } from '../profile-view/profile-view';
import { ChangeProfile } from '../change-profile-view/change-profile-view';
import { DeleteProfile } from '../delete-profile-view/delete-profile-view';
import { ChangeFavorites } from '../change-favorites-view/change-favorites-view';

class MainView extends React.Component {

	constructor() {
		super();

		this.state = {
			user: null,
			users: []
		};
	}

	// One of the "hooks" available in a React Component
	// Takes the token and allows users to stay logged in
	componentDidMount() {
		let accessToken = localStorage.getItem('token');
		if (accessToken !== null) {
			this.setState({
				user: localStorage.getItem('user')
			});
			this.getMovies(accessToken);
			this.getUsers(accessToken);
		}
	}

	onLoggedIn(authData) {
		console.log(authData);
		this.setState({
			user: authData.user.Username
		});

		localStorage.setItem('token', authData.token);
		localStorage.setItem('user', authData.user.Username);
		this.getMovies(authData.token);
		this.getUsers(authData.token);
	}

	getMovies(token) {
		axios
			.get('https://myflixdb5253.herokuapp.com/movies', {
				headers: { Authorization: `Bearer ${token}` }
			})
			.then((response) => {
				// Assign the result to the state
				this.props.setMovies(response.data);
			})
			.catch(function(error) {
				console.log(error);
			});
	}

	getUsers(token) {
		axios
			.get('https://myflixdb5253.herokuapp.com/users/', {
				headers: { Authorization: `Bearer ${token}` }
			})
			.then((response) => {
				this.setState({
					users: response.data
				});
			})
			.catch(function(error) {
				console.log(error);
			});
	}


	logoutUser(user) {
		this.setState({
			user: null
		});
		localStorage.removeItem('token');
		localStorage.removeItem('user');
	}

	render() {

		let { movies } = this.props;
		// If the state isn't initialized, this will throw on runtime
		// before the data is initially loaded
		const { user, users } = this.state;
		const storedUser = localStorage.getItem('user');

		return (
			<div>
				{//Allows the nav bar to not render links until user logs in
				this.state.user ? (
					<div className="navbar">
						<Navbar fixed="top" collapseOnSelect expand="lg" bg="dark" variant="dark">
							<Navbar.Brand href="/">
								<h1>MyFlix</h1>
							</Navbar.Brand>
							<Navbar.Toggle aria-controls="responsive-navbar-nav" />
							<Navbar.Collapse id="responsive-navbar-nav">
								<Nav className="mr-auto">
									<Nav.Link href="/">Movies</Nav.Link>
									<Nav.Link href={`/profile/${user}`}>Account</Nav.Link>
									<Nav.Link onClick={(user) => this.logoutUser()} href="http://localhost:1234/">
										Logout
									</Nav.Link>
								</Nav>
							</Navbar.Collapse>
						</Navbar>
					</div>
				) : (
					<div className="navbar">
						<Navbar fixed="top" collapseOnSelect expand="lg" bg="dark" variant="dark">
							<Navbar.Brand href="/">
								<h1>MyFlix</h1>
							</Navbar.Brand>
						</Navbar>
					</div>
				)}

				<Router basename="/client">
					<div className="main-view">
						<Route exact path="/" render={() => {
								if (!user) return (
									<Container>
											<LoginView onLoggedIn={(user) => this.onLoggedIn(user)} />
									</Container>);
								return (<MoviesList movies={movies} />);
								}}/>

						<Route path="/register" render={() => {
								if (!user)
									return (
										<Container>
											<RegistrationView />
										</Container>
									);
							}}/>

						<Route path="/profile/:username" render={({ match }) => {
								// Users can only see their own account info!
								if (match.params.username === storedUser)
									return (
										<ProfileView user={users.find((m) => m.Username === match.params.username)} />
									);
							}}/>

						<Route path="/profile/:username/update" render={({ match }) => {
								// Users can only see their own account info!
								if (match.params.username === storedUser)
									return (
										<ChangeProfile user={users.find((m) => m.Username === match.params.username)} />
									);
							}}/>

						<Route path="/profile/:username/delete" render={({ match }) => {
								// Users can only see their own account info!
								if (match.params.username === storedUser)
									return (
										<DeleteProfile
											user={users.find((m) => m.Username === match.params.username)}
											onDelete={(user) => this.logoutUser()}/>
									);
							}}/>

						<Route path="/profile/:username/favorites" render={({ match }) => {
								// Users can only see their own account info!
								if (match.params.username === storedUser)
									return (
										<ChangeFavorites
											user={users.find((m) => m.Username === match.params.username)}/>
									);
							}}/>

						<Route path="/movies/:movieId" render={({ match }) => (
								<MovieView 
									addToFav={() => this.addToFav(user)}
									movie={movies.find((m) => m._id === match.params.movieId)}
									user={users.find((m) => m.Username === storedUser)}
									token={localStorage.getItem('token')}/>
							)}/>

						<Route path="/genres/:name" render={({ match }) => {
								if (!movies) return <div className="main-view" />;
								return (
									<GenreView genre={movies.find((m) => m.Genre.Name === match.params.name).Genre} />
								);
							}}
						/>

						<Route path="/directors/:name" render={({ match }) => {
								if (!movies) return <div className="main-view" />;
								return (
									<DirectorView
										director={movies.find((m) => m.Director.Name === match.params.name).Director}/>
								);
							}}/>
					</div>
				</Router>
			</div>
		);
	}
}

let mapStateToProps = state => {
	return { movies: state.movies }
}

export default connect(mapStateToProps, { setMovies } )(MainView);
