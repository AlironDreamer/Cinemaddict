import ApiService from '../framework/api-service.js';
import {Methods} from '../const.js';

export default class CommentsApiService extends ApiService {
  getComments(film) {
    return this._load({url: `comments/${film.id}`})
      .then(ApiService.parseResponse);
  }

  addComment = async (film, comment) => {
    const response = await this._load({
      url: `comments/${film.id}`,
      method: Methods.POST,
      body: JSON.stringify(this.#adaptToServer(comment)),
      headers: new Headers({'Content-Type': 'application/json'})
    });

    return await ApiService.parseResponse(response);
  };

  deleteComment = async (commentID) => {
    const response = await this._load({
      url: `comments/${commentID}`,
      method: Methods.DELETE,
    });
    return response;
  };

  #adaptToServer = (comment) => {
    const adaptedComment = {
      'comment': comment.comment,
      'emotion': comment.emotion
    };
    return adaptedComment;
  };

}
