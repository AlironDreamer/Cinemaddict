import FooterStatsView from '../view/footer-stats-view.js';
import {UpdateType} from '../const.js';
import {remove, render, replace} from '../framework/render.js';

export default class FooterStatsPresenter {
  #container = null;
  #filmsModel = null;

  #footerStatsComponent = null;

  constructor(container, filmsModel) {
    this.#container = container;
    this.#filmsModel = filmsModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);
  }

  init = () => {
    const prevFooterStatsComponent = this.#footerStatsComponent;
    this.#footerStatsComponent = new FooterStatsView(this.#filmsModel.films);

    if (prevFooterStatsComponent === null) {
      render(this.#footerStatsComponent, this.#container);
      return;
    }
    replace(this.#footerStatsComponent, prevFooterStatsComponent);
    remove(prevFooterStatsComponent);
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.INIT:
        this.init();
        break;
    }
  };
}
