import FilmDetailsView from '../view/film-details-view.js';
import {isEscKeyDown} from '../utils/common.js';
import {remove, render, replace} from '../framework/render.js';
import {UpdateType, UserAction} from '../const.js';

export default class FilmDetailsPresenter {
  #film = null;
  #comments = null;
  #bodyContainer = null;
  #filmDetailsComponent = null;
  #changeData = null;
  #closePopup = null;
  #hasLoadingError = false;
  #viewData = {
    scrollPosition: 0,
    emotion:  null,
    comment:  null
  };

  constructor(bodyContainer, changeData, closePopup, hasLoadingError) {
    this.#bodyContainer = bodyContainer;
    this.#changeData = changeData;
    this.#closePopup = closePopup;
    this.#hasLoadingError = hasLoadingError;
  }

  init = (film, comments, hasLoadingError) => {
    this.#film = film;
    this.#comments = comments;
    this.#hasLoadingError = hasLoadingError;

    const prevFilmDetailsComponent = this.#filmDetailsComponent;

    this.#filmDetailsComponent = new FilmDetailsView(this.#film, this.#comments, this.#viewData, this.#updateViewData, this.#hasLoadingError);
    this.#filmDetailsComponent.setClosePopupHandler(() => {
      this.#closePopup();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    });
    this.#filmDetailsComponent.setAddWatchlistClickHandler(this.#handleAddWatchlist);
    this.#filmDetailsComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#filmDetailsComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#filmDetailsComponent.setDeleteClickHandler(this.#handleDeleteClick);

    if (prevFilmDetailsComponent === null) {
      document.addEventListener('keydown', this.#onEscKeyDown);
      render(this.#filmDetailsComponent, this.#bodyContainer);
      return;
    }
    if (this.#bodyContainer.contains(prevFilmDetailsComponent.element)) {
      replace(this.#filmDetailsComponent, prevFilmDetailsComponent);
    }

    this.#filmDetailsComponent.restorePosition();

    remove(prevFilmDetailsComponent);
  };

  destroy = () => {
    remove(this.#filmDetailsComponent);
  };

  clearViewData = () => {
    this.#updateViewData({
      comment: null,
      emotion: null,
      scrollPosition: this.#viewData.scrollPosition
    });
  };

  setCommentCreating = () => {
    this.#filmDetailsComponent.updateElement({
      ...this.#viewData,
      isDisabled: true,
      isCommentCreating: true
    });
  };

  setCommentDeleting = (commentId) => {
    this.#filmDetailsComponent.updateElement({
      ...this.#viewData,
      isDisabled: true,
      deleteCommentId: commentId
    });
  };

  setFilmEditing = () => {
    this.#filmDetailsComponent.updateElement({
      ...this.#viewData,
      isDisabled: true,
      isFilmEditing: true,
    });
  };

  setAborting = ({actionType, commentId}) => {
    this.#filmDetailsComponent.updateElement({
      ...this.#viewData,
      isDisabled: false,
      deleteCommentId: null,
      isFilmEditing: false,
    });

    switch (actionType) {
      case UserAction.UPDATE:
        this.#filmDetailsComponent.shakeControls();
        break;
      case UserAction.ADD:
        this.#filmDetailsComponent.shakeForm();
        break;
      case UserAction.DELETE:
        this.#filmDetailsComponent.shakeComment(commentId);
        break;
    }
  };


  #updateViewData = (viewData) => {
    this.#viewData = {...viewData};
  };

  #onEscKeyDown = (evt) => {
    if(isEscKeyDown(evt)) {
      evt.preventDefault();
      this.#closePopup();
    }
  };

  #handleAddWatchlist = () => {
    this.#changeData(
      UserAction.UPDATE,
      UpdateType.PATCH,
      {
        ...this.#film,
        userDetails: {
          ...this.#film.userDetails,
          watchList: !this.#film.userDetails.watchList
        }
      });
  };

  #handleWatchedClick = () => {
    this.#changeData(
      UserAction.UPDATE,
      UpdateType.PATCH,
      {
        ...this.#film,
        userDetails: {
          ...this.#film.userDetails,
          alreadyWatched: !this.#film.userDetails.alreadyWatched
        }
      });
  };

  #handleFavoriteClick = () => {
    this.#changeData(
      UserAction.UPDATE,
      UpdateType.PATCH,
      {
        ...this.#film,
        userDetails: {
          ...this.#film.userDetails,
          favorite: !this.#film.userDetails.favorite
        }
      });
  };

  handleAddCommentClick = () => {
    if (this.#hasLoadingError) {
      return;
    }
    this.#filmDetailsComponent.setCommentData();

    if (this.#viewData.emotion && this.#viewData.comment) {
      const newComment = {
        comment: this.#viewData.comment,
        emotion: this.#viewData.emotion
      };

      this.#changeData(
        UserAction.ADD,
        UpdateType.PATCH,
        {
          ...this.#film
        },
        newComment
      );
    }
  };

  #handleDeleteClick = (commentID) => {
    const commentIndex = this.#comments.findIndex((comment) => comment.id === commentID);
    this.#changeData(
      UserAction.DELETE,
      UpdateType.PATCH,
      {
        ...this.#film,
        comments: [
          ...this.#film.comments.slice(0, commentIndex),
          ...this.#film.comments.slice(commentIndex + 1)
        ]
      },
      commentID
    );
  };
}
