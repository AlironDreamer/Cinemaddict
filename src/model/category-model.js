import Observable from '../framework/observable.js';
import {Categories} from '../const.js';

export default class CategoryModel extends Observable{
  #category = Categories.All;

  get category() {
    return this.#category;
  }

  setCategory = (updateType, category) => {
    this.#category = category;
    this._notify(updateType, category);
  };
}
