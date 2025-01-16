import {formatDateToDMY, formatDateToHM} from "../utils/format.js";

export const createFilmDetailsInfoTemplate = ({filmInfo}) => {
  const {
    title, alternateTitle,
    totalRating, director,
    writers, actors,
    release, ageRating, poster,
    genre, description, runtime
  } = filmInfo;

  const genreTitle = genre.length > 1 ? 'Genres' : 'Genre';
  const genreMarkup = genre.length > 1 ? genre
    .map((genreItem) => `<span class="film-details__genre">${genreItem}</span>`)
    .join('') : genre;

  return `<div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${poster}" alt="">

          <p class="film-details__age">${ageRating}+</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${title}</h3>
              <p class="film-details__title-original">${alternateTitle}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${totalRating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${writers.join(', ')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${actors.join(', ')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${formatDateToDMY(release.date)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${formatDateToHM(runtime)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${release.releaseCountry}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">${genreTitle}</td>
              <td class="film-details__cell">
              ${genreMarkup}
<!--                <span class="film-details__genre">Film-Noir</span>-->
<!--                <span class="film-details__genre">Mystery</span>-->
              </td>
            </tr>
          </table>

          <p class="film-details__film-description">
            ${description}
          </p>
        </div>
  </div>`;
};
