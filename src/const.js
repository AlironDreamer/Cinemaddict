const YearsDuration = {
  MIN: 1,
  MAX: 10
};

const DaysDuration = {
  MIN: 0,
  MAX: 7
};

const Categories = {
  All: 'all',
  Watchlist: 'watchlist',
  History: 'history',
  Favorites: 'favorites'
};

const Ranks = {
  NONE: 'None',
  NOVICE: 'Novice',
  FAN: 'Fan',
  MOVIEBUFF: 'Movie Buff'
};

const Emotions = ['smile', 'sleeping', 'puke', 'angry'];

const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating'
};

const UserAction = {
  ADD: 'ADD',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE'
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT'
};

const Methods = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

export {
  YearsDuration,
  DaysDuration,
  Categories,
  Ranks,
  Emotions,
  SortType,
  UserAction,
  UpdateType,
  Methods
};
