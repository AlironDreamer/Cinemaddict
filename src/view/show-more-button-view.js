import AbstractView from '../framework/view/abstract-view.js';

const createShowMoreButtonTemplate = () => '<button class="films-list__show-more">Show more</button>';

export default class ShowMoreButtonView extends AbstractView {
  get template() {
    return createShowMoreButtonTemplate();
  }

  setShowMoreHandler = (callback) => {
    this._callback.showMore = callback;
    this.element.addEventListener('click', this.#showMoreHandler);
  };

  removeShowMoreHandler = () => {
    this.element.removeEventListener('click', this.#showMoreHandler);
  };

  #showMoreHandler = (evt) => {
    evt.preventDefault();
    this._callback.showMore();
  };
}
