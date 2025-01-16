import {remove, render, replace} from '../framework/render.js';
import {UpdateType} from '../const.js';
import HeaderUserView from '../view/header-user-view.js';
import {calculateUserRank} from '../utils/user.js';

export default class HeaderUserPresenter {
  #container = null;
  #filmsModel = null;

  #headerUserComponent = null;

  constructor(container, filmsModel) {
    this.#container = container;
    this.#filmsModel = filmsModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);
  }

  init = () => {
    const prevHeaderUserComponent = this.#headerUserComponent;
    const userRank = calculateUserRank(this.#filmsModel.films);
    this.#headerUserComponent = new HeaderUserView(userRank);

    if (prevHeaderUserComponent === null) {
      render(this.#headerUserComponent, this.#container);
      return;
    }
    replace(this.#headerUserComponent, prevHeaderUserComponent);
    remove(prevHeaderUserComponent);
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.INIT:
        this.init();
        break;
    }
  };
}
