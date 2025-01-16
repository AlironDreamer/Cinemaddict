import ApiService from '../framework/api-service.js';
import {Methods} from '../const.js';

export default class FilmsApiService extends ApiService {
  get films() {
    return this._load({url: 'movies'})
      .then(ApiService.parseResponse);
  }

  updateFilm = async (film) => {
    const response = await this._load({
      url: `movies/${film.id}`,
      method: Methods.PUT,
      body: JSON.stringify(this.#adaptToServer(film)),
      headers: new Headers({'Content-Type': 'application/json'})
    });

    return await ApiService.parseResponse(response);
  };

  #adaptToServer = (film) => {
    const adaptedFilm = {
      ...film,
      'film_info': {
        'actors': film.filmInfo.actors,
        'age_rating': film.filmInfo.ageRating,
        'alternative_title': film.filmInfo.alternateTitle,
        'description': film.filmInfo.description,
        'director': film.filmInfo.director,
        'genre': film.filmInfo.genre,
        'poster': film.filmInfo.poster,
        'release': {
          'date': film.filmInfo.release.date,
          'release_country': film.filmInfo.release.releaseCountry
        },
        'runtime': film.filmInfo.runtime,
        'title': film.filmInfo.title,
        'total_rating': film.filmInfo.totalRating,
        'writers': film.filmInfo.writers
      },
      'user_details': {
        'watchlist': film.userDetails.watchList,
        'already_watched': film.userDetails.alreadyWatched,
        'watching_date': film.userDetails.watchingDate,
        'favorite': film.userDetails.favorite
      }
    };

    delete adaptedFilm.filmInfo;
    delete adaptedFilm.userDetails;
    return adaptedFilm;
  };
}
