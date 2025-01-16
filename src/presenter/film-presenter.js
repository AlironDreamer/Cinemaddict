import FilmCardView from '../view/film-card-view.js';
import {remove, render, replace} from '../framework/render.js';
import {UpdateType, UserAction} from '../const.js';

export default class FilmPresenter {
  #filmsListContainer = null;
  #filmComponent = null;
  #film = null;
  #changeData = null;
  #openPopup = null;

  constructor(filmsListContainer, changeData, openPopup) {
    this.#filmsListContainer = filmsListContainer;
    this.#changeData = changeData;
    this.#openPopup = openPopup;
  }

  init = (film) => {
    this.#film = film;
    const prevFilmComponent = this.#filmComponent;

    this.#filmComponent = new FilmCardView(this.#film);
    this.#filmComponent.setOpenPopupHandler(this.#handleOpenPopup);
    this.#filmComponent.setAddWatchlistClickHandler(this.#handleAddWatchlist);
    this.#filmComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#filmComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    if (prevFilmComponent === null) {
      render(this.#filmComponent, this.#filmsListContainer);
      return;
    }
    if (this.#filmsListContainer.contains(prevFilmComponent.element)) {
      replace(this.#filmComponent, prevFilmComponent);
    }

    remove(prevFilmComponent);
  };

  destroy = () => {
    remove(this.#filmComponent);
  };

  setFilmEditing = () => {
    this.#filmComponent.updateElement({isFilmEditing: true});
  };

  setAborting = () => {
    this.#filmComponent.updateElement({isFilmEditing: false});
    this.#filmComponent.shakeControls();
  };

  #handleOpenPopup = () => {
    this.#openPopup(this.#film);
  };

  #handleAddWatchlist = () => {
    this.#changeData(
      UserAction.UPDATE,
      UpdateType.PATCH,
      {
        ...this.#film,
        userDetails: {
          ...this.#film.userDetails,
          watchList: !this.#film.userDetails.watchList
        }
      }
    );
  };

  #handleWatchedClick = () => {
    this.#changeData(
      UserAction.UPDATE,
      UpdateType.PATCH,
      {
        ...this.#film,
        userDetails: {
          ...this.#film.userDetails,
          alreadyWatched: !this.#film.userDetails.alreadyWatched
        }
      }
    );
  };

  #handleFavoriteClick = () => {
    this.#changeData(
      UserAction.UPDATE,
      UpdateType.PATCH,
      {
        ...this.#film,
        userDetails: {
          ...this.#film.userDetails,
          favorite: !this.#film.userDetails.favorite
        }
      }
    );
  };
}
