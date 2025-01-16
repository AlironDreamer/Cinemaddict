import dayjs from 'dayjs';

const sortByDate = (filmA, filmB) => dayjs(filmB.filmInfo.release.date).diff(dayjs(filmA.filmInfo.release.date));

const sortByRating = (filmA, filmB) => filmB.filmInfo.totalRating - filmA.filmInfo.totalRating;

const sortByComments = (filmA, filmB) => filmB.comments.length - filmA.comments.length;

const checkAllZeroRating = (films) => {
  let zeroRatingFilms = 0;
  films.forEach((film) => {
    if (film.filmInfo.totalRating === 0) {
      zeroRatingFilms++;
    }
  });
  return zeroRatingFilms === films.length;
};

const checkCommentsZeroAmount = (films) => {
  let zeroCommentsFilms = 0;
  films.forEach((film) => {
    if (film.comments.length === 0) {
      zeroCommentsFilms++;
    }
  });
  return zeroCommentsFilms === films.length;
};

export {sortByDate, sortByRating, sortByComments, checkAllZeroRating, checkCommentsZeroAmount};
