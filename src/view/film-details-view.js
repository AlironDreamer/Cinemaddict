import {createFilmDetailsInfoTemplate} from './film-details-info-template.js';
import {createFilmDetailsNewCommentTemplate} from './film-details-new-comment-template.js';
import {createFilmDetailsCommentsListTemplate} from './film-details-comments-list-template.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {Emotions} from '../const.js';
import {isUploadKeysDown} from "../utils/common.js";
import {createFilmDetailsLoadingError} from "./film-details-loading-error-template.js";

const createDetailsControlsTemplate = ({alreadyWatched, favorite, watchList}) => {
  const getStatus = (parameter) => parameter
    ? 'film-details__control-button--active'
    : '';
  return `<section class="film-details__controls">
    <button type="button" class="film-details__control-button ${getStatus(watchList)} film-details__control-button--watchlist" id="watchlist" name="watchlist">Add to watchlist</button>
    <button type="button" class="film-details__control-button ${getStatus(alreadyWatched)} film-details__control-button--watched" id="watched" name="watched">Already watched</button>
    <button type="button" class="film-details__control-button ${getStatus(favorite)} film-details__control-button--favorite" id="favorite" name="favorite">Add to favorites</button>
  </section>`;
};

// const checkCommentsLoadingError = (hasLoadingError)
const createCommentsSection = (comments, emotion, comment, hasLoadingError, isDisabled, deleteCommentId) => {
  const checkLoadingError = (error) => error
    ? 'film-details__bottom-container--loading-error'
    : '';
  return `<div class="film-details__bottom-container ${checkLoadingError(hasLoadingError)}">
    ${hasLoadingError ? createFilmDetailsLoadingError() : ''}
    <section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">Comments <span
        class="film-details__comments-count">${comments.length}</span></h3>
      ${createFilmDetailsCommentsListTemplate(comments, deleteCommentId)}

      ${createFilmDetailsNewCommentTemplate(Emotions, emotion, comment, isDisabled)}
    </section>
  </div>`;
};

const createFilmDetailsTemplate = (state, hasLoadingError) => {
  const {film, comments, emotion, comment, isDisabled, deleteCommentId} = state;
  return `<section class="film-details">
  <div class="film-details__inner">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>

      ${createFilmDetailsInfoTemplate(film)}
      ${createDetailsControlsTemplate(film.userDetails)}
    </div>
    ${createCommentsSection(comments, emotion, comment, hasLoadingError, isDisabled, deleteCommentId)}

  </div>
</section>`;
};

export default class FilmDetailsView extends AbstractStatefulView {
  #updateData = null;
  #hasLoadingError = null;

  constructor(film, comments, viewData, updateData, hasLoadingError) {
    super();
    this._state = FilmDetailsView.parseFilmDetailsToState(
      film,
      comments,
      viewData
    );
    this.#updateData = updateData;
    this.#hasLoadingError = hasLoadingError;
    this.#setInnerHandlers();
  }

  get template() {
    return createFilmDetailsTemplate(this._state, this.#hasLoadingError);
  }

  static parseFilmDetailsToState = (film, comments, viewData) => ({
    film,
    comments,
    ...viewData,
    isDisabled: false,
    deleteCommentId: null,
    isFilmEditing: false
  });

  shakeComment = (commentId) => {
    const commentElement = this.element.querySelector(`li[data-comment-id='${commentId}']`);
    this.shake.call({element: commentElement});
  };

  shakeForm = () => {
    const formElement = this.element.querySelector('.film-details__new-comment');
    this.shake.call({element: formElement});
  };

  shakeControls = () => {
    const controlsElement = this.element.querySelector('.film-details__controls');
    this.shake.call({element: controlsElement});
  };

  #setInnerHandlers = () => {
    this.element.querySelectorAll('.film-details__emoji-item')
      .forEach((element) => {
        element.addEventListener('click', this.#emojiChoiceHandler);
      });
    this.element.querySelector('.film-details__comment-input')
      .addEventListener('input', this.#commentInputHandler);
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.restorePosition();
    this.#updateViewData();
    this.setClosePopupHandler(this._callback.closePopup);
    this.setAddWatchlistClickHandler(this._callback.addWatchlistClick);
    this.setWatchedClickHandler(this._callback.watchedClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
    this.setDeleteClickHandler(this._callback.deleteClick);
  };

  #updateViewData = () => {
    this.#updateData({
      emotion: this._state.emotion,
      comment: this._state.comment,
      scrollPosition: this.element.scrollTop
    });
  };

  setCommentData = () => {
    this.#updateViewData();
  };

  restorePosition = () => {
    this.element.scrollTop = this._state.scrollPosition;
  };

  setClosePopupHandler = (callback) => {
    this._callback.closePopup = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closePopupHandler);
  };

  setAddWatchlistClickHandler = (callback) => {
    this._callback.addWatchlistClick = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#addWatchlistHandler);
  };

  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#watchedHandler);
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#favoriteHandler);
  };

  setDeleteClickHandler = (callback) => {
    this._callback.deleteClick = callback;
    if (this.element.querySelector('.film-details__comment-delete')) {
      this.element.querySelectorAll('.film-details__comment-delete')
        .forEach((element) => {
          element.addEventListener('click', this.#commentDeleteHandler);
        });
    }
  };

  #emojiChoiceHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      emotion: evt.target.value,
      scrollPosition: this.element.scrollTop
    });
  };

  #commentDeleteHandler = (evt) => {
    evt.preventDefault();
    this.#updateViewData();
    const commentElement = evt.target.closest('.film-details__comment');
    this._callback.deleteClick(commentElement.dataset.commentId);
  };

  #commentInputHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      comment: evt.target.value
    });
  };

  #closePopupHandler = (evt) => {
    evt.preventDefault();
    this._callback.closePopup();
  };

  #addWatchlistHandler = (evt) => {
    evt.preventDefault();
    this.#updateViewData();
    this._callback.addWatchlistClick();
  };

  #watchedHandler = (evt) => {
    evt.preventDefault();
    this.#updateViewData();
    this._callback.watchedClick();
  };

  #favoriteHandler = (evt) => {
    evt.preventDefault();
    this.#updateViewData();
    this._callback.favoriteClick();
  };

}
