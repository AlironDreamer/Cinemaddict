import {render, remove} from '../framework/render.js';
import {isUploadKeysDown} from '../utils/common.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import SortView from '../view/sort-view.js';
import FilmsListViewExtra from '../view/films-list-view-extra.js';
import FilmsListView from '../view/films-list-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import FilmsView from '../view/films-view.js';
import LoadingView from '../view/loading-view.js';
import NoFilmsView from '../view/no-films-view.js';
import FilmPresenter from './film-presenter.js';
import FilmDetailsPresenter from './film-details-presenter.js';
import {Categories, SortType, UpdateType, UserAction} from '../const.js';
import {checkAllZeroRating, checkCommentsZeroAmount, sortByDate, sortByRating, sortByComments} from '../utils/films.js';
import {filter} from '../utils/filter.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

const FILM_COUNT_PER_STEP = 5;
const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class FilmsPresenter {
  #container = null;
  #filmsModel = null;
  #commentsModel = null;
  #categoryModel = null;
  #selectedFilm = null;
  #shownFilmsAmount=  5;
  #filmPresenters = new Map();
  #topRatedFilmPresenters = new Map();
  #topCommentedFilmPresenters = new Map();
  #filmDetailsPresenter = null;
  #currentSortType = SortType.DEFAULT;
  #categoryType = Categories.All;

  #sortComponent = null;
  #loadingComponent = new LoadingView();
  #filmsComponent = new FilmsView();
  #noFilmsComponent = null;
  #filmsListComponent = new FilmsListView();
  #filmsListTopRatedComponent = null;
  #filmsListTopCommentedComponent = null;
  #filmsListContainerComponent = new FilmsListContainerView();
  #filmsListTopRatedContainerComponent = null;
  #filmsListTopCommentedContainerComponent = null;
  #showMoreComponent = null;

  #isLoading = true;
  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  constructor(mainContainer, filmsModel, commentsModel, categoryModel) {
    this.#container = mainContainer;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
    this.#categoryModel = categoryModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#commentsModel.addObserver(this.#handleModelEvent);
    this.#categoryModel.addObserver(this.#handleModelEvent);
  }

  get films() {
    this.#categoryType = this.#categoryModel.category;
    const films = this.#filmsModel.films;
    const filteredFilms = filter[this.#categoryType](films);
    switch (this.#currentSortType) {
      case SortType.DATE:
        return filteredFilms.sort(sortByDate);
      case SortType.RATING:
        return filteredFilms.sort(sortByRating);
    }
    return filteredFilms;
  }

  init = () => {
    this.#renderFilmsBoard();
  };


  #renderSort = () => {
    if (this.films.length === 0) {
      return;
    }

    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#sortComponent, this.#container);
  };

  #renderFilmsBoard = () => {
    this.#renderSort();
    render(this.#filmsComponent, this.#container);
    render(this.#filmsListComponent, this.#filmsComponent.element);

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (this.films.length === 0) {
      this.#renderNoFilms();
      return;
    }

    render(this.#filmsListContainerComponent, this.#filmsListComponent.element);

    this.#renderFilms(this.films.slice(0, Math.min(this.films.length, this.#shownFilmsAmount)));
    if (this.#shownFilmsAmount < this.films.length) {
      this.#renderMoreButton();
    }

    if (!checkAllZeroRating(this.films)) {
      this.#filmsListTopRatedComponent = new FilmsListViewExtra('Top rated');
      this.#filmsListTopRatedContainerComponent = new FilmsListContainerView();
      render(this.#filmsListTopRatedComponent, this.#filmsComponent.element);
      render(this.#filmsListTopRatedContainerComponent, this.#filmsListTopRatedComponent.element);
      this.#renderTopRatedFilms(this.films.sort(sortByRating).slice(0,2));
    }

    if (!checkCommentsZeroAmount(this.films)) {
      this.#filmsListTopCommentedComponent = new FilmsListViewExtra('Top commented');
      this.#filmsListTopCommentedContainerComponent= new FilmsListContainerView();
      render(this.#filmsListTopCommentedComponent, this.#filmsComponent.element);
      render(this.#filmsListTopCommentedContainerComponent, this.#filmsListTopCommentedComponent.element);
      this.#renderTopCommentedFilms(this.films.sort(sortByComments).slice(0,2));
    }
  };

  #renderFilms = (films) => {
    films
      .forEach((film) => this.#renderFilm(film));
  };

  #renderFilm = (film) => {
    const filmPresenter = new FilmPresenter(this.#filmsListContainerComponent.element, this.#handleViewAction, this.#addFilmDetails);
    filmPresenter.init(film);
    this.#filmPresenters.set(film.id, filmPresenter);
  };

  #renderTopRatedFilms = (films) => {
    films
      .forEach((film) => this.#renderTopRatedFilm(film));
  };

  #renderTopRatedFilm = (film) => {
    const topRatedFilmPresenter = new FilmPresenter(this.#filmsListTopRatedContainerComponent.element, this.#handleViewAction, this.#addFilmDetails);
    topRatedFilmPresenter.init(film);
    this.#topRatedFilmPresenters.set(film.id, topRatedFilmPresenter);
  };

  #renderTopCommentedFilms = (films) => {
    films
      .forEach((film) => this.#renderTopCommentedFilm(film));
  };

  #renderTopCommentedFilm = (film) => {
    const topCommentedFilmPresenter = new FilmPresenter(this.#filmsListTopCommentedContainerComponent.element, this.#handleViewAction, this.#addFilmDetails);
    topCommentedFilmPresenter.init(film);
    this.#topCommentedFilmPresenters.set(film.id, topCommentedFilmPresenter);
  };

  #rerenderTopRatedFilms = () => {
    this.#topRatedFilmPresenters.forEach((film) => film.destroy());
    this.#topRatedFilmPresenters.clear();
    this.#renderTopRatedFilms(this.films.sort(sortByRating).slice(0,2));
  };

  #rerenderMostCommentedFilms = () => {
    this.#topCommentedFilmPresenters.forEach((film) => film.destroy());
    this.#topCommentedFilmPresenters.clear();
    this.#renderTopCommentedFilms(this.films.sort(sortByComments).slice(0,2));
  };

  #renderNoFilms = () => {
    this.#noFilmsComponent = new NoFilmsView(this.#categoryType);
    render(this.#noFilmsComponent, this.#filmsListComponent.element);
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#filmsListComponent.element);
  };

  #renderMoreButton = () => {
    this.#showMoreComponent = new ShowMoreButtonView();
    this.#showMoreComponent.setShowMoreHandler(() => {
      this.#handleMoreFilms();
    });
    render(this.#showMoreComponent, this.#filmsListComponent.element);
  };

  #handleMoreFilms = () => {
    const filmsCount = this.films.length;
    const newShownFilmAmount = Math.min(filmsCount, this.#shownFilmsAmount + FILM_COUNT_PER_STEP);
    const films = this.films.slice(this.#shownFilmsAmount, newShownFilmAmount);

    this.#renderFilms(films);
    this.#shownFilmsAmount = newShownFilmAmount;

    if (this.#shownFilmsAmount >= filmsCount) {
      remove(this.#showMoreComponent);
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearFilmsBoard({resetShownFilmsAmount: true});
    this.#renderFilmsBoard();
  };

  #clearFilmsBoard = ({resetShownFilmsAmount = false, resetSortType = false} = {}) => {
    this.#filmPresenters.forEach((film) => film.destroy());
    this.#filmPresenters.clear();
    this.#topRatedFilmPresenters.forEach((film) => film.destroy());
    this.#topRatedFilmPresenters.clear();
    this.#topCommentedFilmPresenters.forEach((film) => film.destroy());
    this.#topCommentedFilmPresenters.clear();

    remove(this.#sortComponent);
    remove(this.#showMoreComponent);

    remove(this.#filmsListTopRatedComponent);
    remove(this.#filmsListTopRatedContainerComponent);

    remove(this.#filmsListTopCommentedComponent);
    remove(this.#filmsListTopCommentedContainerComponent);

    if (this.#noFilmsComponent) {
      remove(this.#noFilmsComponent);
    }

    if (resetShownFilmsAmount) {
      this.#shownFilmsAmount = 5;
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };

  #handleViewAction = async (actionType, updateType, updateFilm, updateComment) => {
    this.#uiBlocker.block();
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update... - обновленные данные
    switch (actionType) {
      case UserAction.ADD:
        this.#filmDetailsPresenter.setCommentCreating();
        try {
          await this.#commentsModel.addComment(updateType, updateFilm, updateComment);
        } catch (err) {
          this.#filmDetailsPresenter.setAborting({actionType});
        }
        break;
      case UserAction.UPDATE:
        if (this.#filmPresenters.get(updateFilm.id) && !this.#filmDetailsPresenter) {
          this.#filmPresenters.get(updateFilm.id).setFilmEditing();
        }

        if (!this.#filmPresenters.get(updateFilm.id) && this.#topCommentedFilmPresenters.get(updateFilm.id) && !this.#filmDetailsPresenter) {
          this.#topCommentedFilmPresenters.get(updateFilm.id).setFilmEditing();
        }

        if (!this.#filmPresenters.get(updateFilm.id) && this.#topRatedFilmPresenters.get(updateFilm.id) && !this.#filmDetailsPresenter) {
          this.#topRatedFilmPresenters.get(updateFilm.id).setFilmEditing();
        }

        if (this.#filmDetailsPresenter) {
          this.#filmDetailsPresenter.setFilmEditing();
        }

        try {
          await this.#filmsModel.updateFilm(updateType, updateFilm);
        } catch (err) {
          if (this.#filmPresenters.get(updateFilm.id) && !this.#filmDetailsPresenter) {
            this.#filmPresenters.get(updateFilm.id).setAborting();
          }
          if (this.#filmDetailsPresenter) {
            this.#filmDetailsPresenter.setAborting({actionType});
          }
        }
        break;
      case UserAction.DELETE:
        this.#filmDetailsPresenter.setCommentDeleting(updateComment);
        try {
          await this.#commentsModel.deleteComment(updateType, updateFilm, updateComment);
        } catch (err) {
          this.#filmDetailsPresenter.setAborting({actionType, commentId: updateComment});
        }
        break;
    }
    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    // В зависимости от типа изменений решаем, что делать:
    // - обновить часть списка  (добавление / удаление комментария)
    // - обновить доску (сортировка фильмов)
    // - обновить доску с учетом сброса параметров (например, при переключении фильтра)
    switch (updateType) {
      case UpdateType.PATCH:
        // для обновления карточки с фильмом и блока с топом по комментариям
        if (this.#filmPresenters.get(data.id)) {
          this.#filmPresenters.get(data.id).init(data);
        }
        if (this.#filmDetailsPresenter) {
          this.#filmDetailsPresenter.clearViewData();
          this.#selectedFilm = data;
          this.#renderFilmDetails();
        }
        // Если мы находимся в условиях фильтрации, то также нужно осуществить перерисовку всей доски
        if (this.#categoryModel.category !== Categories.All) {
          this.#handleModelEvent(UpdateType.MINOR);
        }
        this.#rerenderTopRatedFilms();
        this.#rerenderMostCommentedFilms();

        break;
      case UpdateType.MINOR:
        // для сортировки фильмов
        this.#clearFilmsBoard();
        this.#renderFilmsBoard();
        break;
      case UpdateType.MAJOR:
        // для фильтрации (обновление списка фильмов, сброс сортировки и счетчика показанных фильмов)
        this.#clearFilmsBoard({resetShownFilmsAmount: true, resetSortType: true});
        this.#renderFilmsBoard();
        if (this.#filmDetailsPresenter) {
          this.#selectedFilm = this.#filmsModel.getFilmById(this.#selectedFilm.id);
          this.#renderFilmDetails();
        }
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderFilmsBoard();
        break;
    }
  };

  #addFilmDetails = (film) => {
    if (this.#selectedFilm && this.#selectedFilm.id === film.id) {
      return;
    }
    if (this.#selectedFilm && this.#selectedFilm.id !== film.id) {
      this.#removeFilmDetails();
    }
    this.#selectedFilm = film;
    this.#renderFilmDetails();
  };

  #renderFilmDetails = async () => {
    let comments = [];
    let hasCommentsError = false;

    try {
      // Устанавливаем тайм-аут ожидания сервера
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout: Failed to load comments')), 3000)
      );

      // Ожидаем завершения либо запроса к серверу, либо тайм-аута
      comments = await Promise.race([
        this.#commentsModel.get(this.#selectedFilm),
        timeoutPromise,
      ]);
    } catch (error) {
      hasCommentsError = true;
      comments = [];
    }

    if (!this.#filmDetailsPresenter) {
      this.#filmDetailsPresenter = new FilmDetailsPresenter(
        this.#container.parentElement,
        this.#handleViewAction,
        this.#removeFilmDetails,
        hasCommentsError
      );
      document.body.classList.add('hide-overflow');
    }

    document.addEventListener('keydown', this.#uploadFormHandler);
    this.#filmDetailsPresenter.init(this.#selectedFilm, comments, hasCommentsError);
  };

  #removeFilmDetails = () => {
    this.#filmDetailsPresenter.destroy();
    this.#filmDetailsPresenter = null;
    this.#selectedFilm = null;
    document.body.classList.remove('hide-overflow');
  };

  #uploadFormHandler = (evt) => {
    if (isUploadKeysDown(evt)) {
      evt.preventDefault();
      this.#filmDetailsPresenter.handleAddCommentClick();
    }
  };
}
