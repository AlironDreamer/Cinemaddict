import AbstractView from '../framework/view/abstract-view.js';
import {Ranks} from '../const.js';

const createUserRankTemplate = (rank) =>
  rank !== Ranks.NONE
    ? `<p class="profile__rating">${rank}</p>`
    : '';

const createHeaderUserTemplate = (rank) =>
  `<section class="header__profile profile">
    ${createUserRankTemplate(rank)}
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;

export default class HeaderUserView extends AbstractView {
  #rank = null;

  constructor(rank) {
    super();
    this.#rank = rank;
  }

  get template() {
    return createHeaderUserTemplate(this.#rank);
  }
}
