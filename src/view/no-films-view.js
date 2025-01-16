import AbstractView from '../framework/view/abstract-view.js';
import {Categories} from '../const.js';

const noFilmsTextValue = {
  [Categories.All]: 'There are no movies in our database',
  [Categories.Watchlist]: 'There are no movies to watch now',
  [Categories.History]: 'There are no watched movies now',
  [Categories.Favorites]: 'There are no favorite movies now'
};

const createNoMoreFilmsTemplate = (categoryType) => {
  return `<h2 class="films-list__title">${noFilmsTextValue[categoryType]}</h2>`;
};

export default class NoFilmsView extends AbstractView {
  #categoryType = null;

  constructor(categoryType) {
    super();
    this.#categoryType = categoryType;
  }

  get template() {
    return createNoMoreFilmsTemplate(this.#categoryType);
  }
}
