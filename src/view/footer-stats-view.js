import AbstractView from '../framework/view/abstract-view.js';

const createFooterStatsTemplate = (filmsAmount) =>
  `<p>${filmsAmount} movies inside</p>`;

export default class FooterStatsView extends AbstractView {
  #filmsAmount = null;

  constructor(films) {
    super();
    this.#filmsAmount = films.length;
  }

  get template() {
    return createFooterStatsTemplate(this.#filmsAmount);
  }

}
