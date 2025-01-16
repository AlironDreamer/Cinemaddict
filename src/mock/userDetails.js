import {getRandomInteger} from '../utils/common.js';
import {DaysDuration} from '../const.js';

const isInWatchlist = () => Boolean(getRandomInteger(0,1));
const isWatched = () => Boolean(getRandomInteger(0,1));
const isFavorite = () => Boolean(getRandomInteger(0,1));
const getDate = () => {
  const date = new Date();
  date.setFullYear(
    date.getFullYear() - getRandomInteger(DaysDuration.MIN, DaysDuration.MAX)
  );
  return date.toISOString();
};

export const generateUserDetails = () => ({
  watchList: isInWatchlist(),
  alreadyWatched:isWatched(),
  watchingDate: getDate(),
  favorite: isFavorite()
});
