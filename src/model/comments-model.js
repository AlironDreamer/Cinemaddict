import Observable from '../framework/observable.js';

export default class CommentsModel extends Observable {
  #commentsApiService = null;
  #comments = [];
  #filmsModel = null;

  constructor(commentsApiService, filmsModel) {
    super();
    this.#commentsApiService = commentsApiService;
    this.#filmsModel = filmsModel;
  }

  get = async (film) => {
    try {
      this.#comments = await this.#commentsApiService.getComments(film);
    } catch (err) {
      throw new Error('Can\'t get comments');
    }

    return this.#comments;
  };

  addComment = async (updateType, updateFilm, updateComment) => {
    try {
      const response = await this.#commentsApiService.addComment(updateFilm, updateComment);
      const newComment = this.#adaptToClient(response);
      this.#comments = [
        ...this.#comments,
        newComment
      ];
      // Поскольку имя пользователя и id комментария генерируются на сервере, после получения ответа
      // обновим объект фильма на клиенте (который также уже обновился на сервере) чтобы поддержать связность данных с клиентом
      await this.#filmsModel.updateOnClient({
        updateType,
        update: response.movie,
        isAdapted: false
      });
    } catch (err) {
      throw new Error('Can\'t add comment');
    }
  };

  deleteComment = async (updateType, updateFilm, updateComment) => {
    const index = this.#comments.findIndex((comment) => comment.id === updateComment);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    try {
      await this.#commentsApiService.deleteComment(updateComment);
      this.#comments = [
        ...this.#comments.slice(0, index),
        ...this.#comments.slice(index + 1)
      ];
      await this.#filmsModel.updateOnClient({
        updateType,
        update: updateFilm,
        isAdapted: true
      });
    } catch (err) {
      throw new Error('Can\'t delete comment');
    }
  };

  #adaptToClient = (response) => {
    const addedComment = response.comments.at(-1);
    return {
      id: addedComment['id'],
      author: addedComment['author'],
      comment: addedComment['comment'],
      date: addedComment['date'],
      emotion: addedComment['emotion']
    };
  };
}
