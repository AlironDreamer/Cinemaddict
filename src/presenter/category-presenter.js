import {Categories, UpdateType} from '../const.js';
import {filter} from '../utils/filter.js';
import NavigationView from '../view/navigation-view.js';
import {remove, render, replace} from '../framework/render.js';

export default class CategoryPresenter {
  #categoryContainer = null;
  #categoryModel = null;
  #filmsModel = null;

  #categoryComponent = null;

  constructor(categoryContainer, categoryModel, filmsModel) {
    this.#categoryContainer = categoryContainer;
    this.#categoryModel = categoryModel;
    this.#filmsModel = filmsModel;

    this.#categoryModel.addObserver(this.#handleModelEvent);
    this.#filmsModel.addObserver(this.#handleModelEvent);
  }

  get categories() {
    const films = this.#filmsModel.films;

    return [
      {
        type: Categories.All,
        name: 'all',
        count: filter[Categories.All](films).length
      },
      {
        type: Categories.Watchlist,
        name: 'watchlist',
        count: filter[Categories.Watchlist](films).length
      },
      {
        type: Categories.History,
        name: 'history',
        count: filter[Categories.History](films).length
      },
      {
        type: Categories.Favorites,
        name: 'favorites',
        count: filter[Categories.Favorites](films).length
      }
    ];
  }

  init = () => {
    const categories = this.categories;
    const prevCategoryComponent = this.#categoryComponent;

    this.#categoryComponent = new NavigationView(categories, this.#categoryModel.category);
    this.#categoryComponent.setCategoryTypeChangeHandler(this.#handleCategoryTypeChange);

    if (prevCategoryComponent === null) {
      render(this.#categoryComponent, this.#categoryContainer);
      return;
    }

    replace(this.#categoryComponent, prevCategoryComponent);
    remove(prevCategoryComponent);
  };

  #handleModelEvent = () => {
    this.init();
  };

  #handleCategoryTypeChange = (categoryType) => {
    if (this.#categoryModel.category === categoryType) {
      return;
    }

    this.#categoryModel.setCategory(UpdateType.MAJOR, categoryType);
  };
}
