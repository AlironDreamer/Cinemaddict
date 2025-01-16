import AbstractView from '../framework/view/abstract-view.js';
import {Categories, SortType} from '../const.js';

const createNavigationItemTemplate = ({type, name, count}, currentCategoryType) => {
  const getCategoryName = (categoryName) =>
    (categoryName === Categories.All)
      ? 'All movies'
      : `${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}`;
  const getCategoryTextContent = (categoryName) =>
    (categoryName !== Categories.All)
      ? `<span class="main-navigation__item-count">${count}</span>`
      : '';
  return`
    <a
        href="#${name}"
        class="
            main-navigation__item
            ${type === currentCategoryType ? 'main-navigation__item--active' : ''}"
        data-category-type="${name}"
    >
        ${getCategoryName(name)}
        ${getCategoryTextContent(name)}
    </a>
  `;
};

const createNavigationTemplate = (categories, currentCategoryType) => {
  const categoryItemsTemplate = categories
    .map((category) => createNavigationItemTemplate(category, currentCategoryType))
    .join('');
  return `<nav class="main-navigation">
    ${categoryItemsTemplate}
  </nav>`;
};

export default class NavigationView extends AbstractView {
  #categories = null;
  #currentCategory = null;

  constructor(categories, currentCategoryType) {
    super();
    this.#categories = categories;
    this.#currentCategory = currentCategoryType;
  }

  get template() {
    return createNavigationTemplate(this.#categories, this.#currentCategory);
  }

  setCategoryTypeChangeHandler = (callback) => {
    this._callback.categoryTypeChange = callback;
    this.element.querySelectorAll('.main-navigation__item')
      .forEach((element) => element.addEventListener('click', this.#categoryTypeChangeHandler));
  };

  #categoryTypeChangeHandler = (evt) => {
    evt.preventDefault();
    console.log(evt.target.dataset.categoryType);
    this._callback.categoryTypeChange(evt.target.dataset.categoryType);
  };
}
