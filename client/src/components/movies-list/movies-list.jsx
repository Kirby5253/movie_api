import React from 'react';
import { connect } from 'react-redux';
import { Container } from 'react-bootstrap';

import VisibilityFilterInput from '../visibility-filter-input/visibility-filter-input';
import { MovieCard } from '../movie-card/movie-card';

const mapStateToProps = state => {
  const { visibilityFilter } = state;
  return { visibilityFilter };
};

function MoviesList(props) {
  const { movies, visibilityFilter } = props;
  let filteredMovies = movies;

  if (visibilityFilter !== '') {
    filteredMovies = movies.filter(m => m.Title.includes(visibilityFilter));
  }

  if (!movies) return <div className="main-view"/>;

  return  <Container className="movies-list">
    <VisibilityFilterInput  visibilityFilter={visibilityFilter}/><div className="movies-list grid">{
  filteredMovies.map(m => <MovieCard key={m._id} movie={m}/>)} </div></Container>

}


export default connect(mapStateToProps)(MoviesList);