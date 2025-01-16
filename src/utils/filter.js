import {Categories} from '../const.js';

const filter = {
  [Categories.All]: (films) => [...films],
  [Categories.Watchlist]: (films) => films.filter((film) => film.userDetails.watchList),
  [Categories.History]: (films) => films.filter((film) => film.userDetails.alreadyWatched),
  [Categories.Favorites]: (films) => films.filter((film) => film.userDetails.favorite),
};

export {filter};
