import {getRandomInteger} from '../utils/common.js';
import {YearsDuration} from "../const.js";

const getDate = () => {
  const date = new Date();
  date.setFullYear(
    date.getFullYear() - getRandomInteger(YearsDuration.MIN, YearsDuration.MAX)
  );
  return date.toISOString();
};


const generateAuthor = () => {
  const authors = [
    'Arthur Rivera',
    'Charles Ramos',
    'Jill Williams',
    'Rhonda Carroll',
    'Matthew Boyd',
    'Robert Lindsey',
    'Joy Carter',
    'Joseph Clarke',
    'John Gardner',
    'Donna Sharp'
  ];

  const randomIndex = getRandomInteger(0, authors.length - 1);
  return authors[randomIndex];
};

const generateCommentText = () => {
  const commentText = [
    'CommentText',
    'CommentText CommentText',
    'CommentText CommentText CommentText',
    'CommentText CommentText CommentText CommentText',
    'CommentText CommentText CommentText CommentText CommentText',
    'CommentText CommentText CommentText CommentText CommentText CommentText',
    'CommentText CommentText CommentText CommentText CommentText CommentText CommentText',
    'CommentText CommentText CommentText CommentText CommentText CommentText CommentText CommentText',
    'CommentText CommentText CommentText CommentText CommentText CommentText CommentText CommentText CommentText',
  ];

  const randomIndex = getRandomInteger(0, commentText.length - 1);
  return commentText[randomIndex];
};

const generateEmotion = () => {
  const emotions = [
    'smile',
    'sleeping',
    'puke',
    'angry'
  ];
  const randomIndex = getRandomInteger(0, emotions.length - 1);
  return emotions[randomIndex];
};

export const getCommentsAmount = (films) => films.reduce((sum, film) => sum + film.comments.length, 0);

const generateComment = () => ({
  author: generateAuthor(),
  comment: generateCommentText(),
  date: getDate(),
  emotion: generateEmotion()
});

export const generateComments = (amount) => Array.from({length: amount}, (_value, index) => ({
  id: String(index + 1),
  ...generateComment()
}));
