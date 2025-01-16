import Observable from '../framework/observable.js';
import {UpdateType} from '../const.js';

export default class FilmsModel extends Observable {
  #filmsApiService = null;
  #films = [];

  constructor(filmsApiService) {
    super();
    this.#filmsApiService = filmsApiService;
  }

  get films() {
    return this.#films;
  }

  init = async () => {
    try {
      const films = await this.#filmsApiService.films;
      this.#films = films.map(this.#adaptToClient);
    } catch (err) {
      this.#films = [];
    }

    this._notify(UpdateType.INIT, null);
  };

  getFilmById = (id) => this.#films.find((film) => film.id === id);

  updateOnClient = async ({updateType, update, isAdapted}) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    const updatedFilm = (!isAdapted)
      ? this.#adaptToClient(update)
      : update;

    this.#films = [
      ...this.#films.slice(0, index),
      updatedFilm,
      ...this.#films.slice(index + 1),
    ];

    this._notify(updateType, updatedFilm);
  };

  updateFilm = async (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    try {
      const response = await this.#filmsApiService.updateFilm(update);
      const updatedFilm = this.#adaptToClient(response);

      this.#films = [
        ...this.#films.slice(0, index),
        updatedFilm,
        ...this.#films.slice(index + 1)
      ];

      this._notify(updateType, updatedFilm);
    } catch (err) {
      throw new Error('Can\'t update film');
    }

  };

  deleteComment = (updateType, update) => {
    const changedFilmIndex = this.#films.findIndex((film) => film.id === update.filmIndex);
    let changedFilm = this.#films.find((film) => film.id === update.filmIndex);
    if (changedFilm === null || changedFilmIndex === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    changedFilm = {
      ...changedFilm,
      comments: changedFilm.comments.filter((comment) => comment !== update.commentID)
    };

    this.#films = [
      ...this.#films.slice(0, changedFilmIndex),
      changedFilm,
      ...this.#films.slice(changedFilmIndex + 1)
    ];

    this._notify(updateType, changedFilm);
  };

  #adaptToClient = (film) => {
    const adaptedFilm = {
      ...film,
      filmInfo: {
        actors: film['film_info']['actors'],
        ageRating: film['film_info']['age_rating'],
        alternateTitle: film['film_info']['alternative_title'],
        description: film['film_info']['description'],
        director: film['film_info']['director'],
        genre: film['film_info']['genre'],
        poster: film['film_info']['poster'],
        release: {
          date: film['film_info']['release']['date'],
          releaseCountry: film['film_info']['release']['release_country']
        },
        runtime: film['film_info']['runtime'],
        title: film['film_info']['title'],
        totalRating: film['film_info']['total_rating'],
        writers: film['film_info']['writers']
      },
      userDetails: {
        watchList: film['user_details']['watchlist'],
        alreadyWatched: film['user_details']['already_watched'],
        watchingDate: film['user_details']['watching_date'],
        favorite: film['user_details']['favorite']
      }
    };

    delete adaptedFilm['film_info'];
    delete adaptedFilm['user_details'];

    return adaptedFilm;
  };
}
