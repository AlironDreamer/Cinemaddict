import {Ranks} from '../const.js';

const calculateUserRank = (films) => {
  const watchedFilms = films.filter((film) => film.userDetails.alreadyWatched).length;
  let rank = Ranks.NONE;
  if (watchedFilms >= 1 && watchedFilms <= 10) {
    rank = Ranks.NOVICE;
  }
  if (watchedFilms >= 11 && watchedFilms <= 20) {
    rank = Ranks.FAN;
  }
  if (watchedFilms >= 21) {
    rank = Ranks.MOVIEBUFF;
  }
  return rank;
};

export { calculateUserRank };
