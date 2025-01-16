import AbstractView from '../framework/view/abstract-view.js';
import {formatDateToHM, formatDateToYear} from '../utils/format.js';
import AbstractStatefulView from "../framework/view/abstract-stateful-view.js";

const createCardControlsTemplate = ({alreadyWatched, favorite, watchList}, isFilmEditing) => {
  const getStatus = (parameter) => parameter
    ? 'film-card__controls-item--active'
    : '';
  return `<div class="film-card__controls">
    <button class="film-card__controls-item ${getStatus(watchList)} film-card__controls-item--add-to-watchlist" type="button" ${(isFilmEditing) ? 'disabled' : ''}>Add to
      watchlist
    </button>
    <button class="film-card__controls-item ${getStatus(alreadyWatched)} film-card__controls-item--mark-as-watched" type="button" ${(isFilmEditing) ? 'disabled' : ''}>Mark as
      watched
    </button>
    <button class="film-card__controls-item ${getStatus(favorite)} film-card__controls-item--favorite" type="button" ${(isFilmEditing) ? 'disabled' : ''}>Mark as favorite
    </button>
  </div>`;
};

const createFilmCardTemplate = ({filmInfo, comments, userDetails, isFilmEditing}) => {
  const {
    title, totalRating,
    release, runtime, poster,
    genre, description
  } = filmInfo;

  const mainGenre = genre.length > 1 ? genre.slice(0, 1) : genre;

  return `<article class="film-card">
     <a class="film-card__link">
       <h3 class="film-card__title">${title}</h3>
       <p class="film-card__rating">${totalRating}</p>
       <p class="film-card__info">
         <span class="film-card__year">${formatDateToYear(release.date)}</span>
         <span class="film-card__duration">${formatDateToHM(runtime)}</span>
         <span class="film-card__genre">${mainGenre}</span>
       </p>
       <img src="${poster}" alt="" class="film-card__poster">
       <p class="film-card__description">${description}</p>
       <span class="film-card__comments">${comments.length} comments</span>
     </a>
     ${createCardControlsTemplate(userDetails, isFilmEditing)}
   </article>`;
};

export default class FilmCardView extends AbstractStatefulView  {
  constructor(film) {
    super();
    this._state = FilmCardView.parseFilmToState(film);
  }

  get template() {
    return createFilmCardTemplate(this._state);
  }

  shakeControls = () => {
    const controlsElement = this.element.querySelector('.film-card__controls');
    this.shake.call({element: controlsElement});
  };

  _restoreHandlers = () => {
    this.setOpenPopupHandler(this._callback.openPopup);
    this.setAddWatchlistClickHandler(this._callback.addWatchlistClick);
    this.setWatchedClickHandler(this._callback.watchedClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
  };

  setOpenPopupHandler = (callback) => {
    this._callback.openPopup = callback;
    this.element.querySelector('a').addEventListener('click', this.#openPopupHandler);
  };

  setAddWatchlistClickHandler = (callback) => {
    this._callback.addWatchlistClick = callback;
    this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#addWatchlistHandler);
  };

  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#watchedHandler);
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#favoriteHandler);
  };

  #openPopupHandler = (evt) => {
    evt.preventDefault();
    this._callback.openPopup();
  };

  #addWatchlistHandler = (evt) => {
    evt.preventDefault();
    this._callback.addWatchlistClick();
  };

  #watchedHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchedClick();
  };

  #favoriteHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  };

  static parseFilmToState = (film) => ({
    ...film,
    isFilmEditing: false
  });
}
