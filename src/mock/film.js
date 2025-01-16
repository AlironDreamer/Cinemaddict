import {getRandomInteger} from '../utils/common.js';
import {generateUserDetails} from './userDetails.js';
import {YearsDuration} from '../const.js';

const getDate = () => {
  const date = new Date();
  date.setFullYear(
    date.getFullYear() - getRandomInteger(YearsDuration.MIN, YearsDuration.MAX)
  );
  return date.toISOString();
};

const generateTitles = () => {
  const titles = [
    'The Dance of Life',
    'Sagebrush Trail',
    'The Man with the Golden Arm',
    'Santa Claus Conquers the Martians',
    'Popeye the Sailor Meets Sindbad the Sailor',
    'The Great Flamarion',
    'Made for Each Other'
  ];

  const randomIndex = getRandomInteger(0, titles.length - 1);

  return titles[randomIndex];
};

const generateRating = () => (Math.random() * 10).toFixed(1);

const generatePoster = () => {
  const posters = [
    './images/posters/the-dance-of-life.jpg',
    './images/posters/sagebrush-trail.jpg',
    './images/posters/the-man-with-the-golden-arm.jpg',
    './images/posters/santa-claus-conquers-the-martians.jpg',
    './images/posters/popeye-meets-sinbad.png',
    './images/posters/the-great-flamarion.jpg',
    './images/posters/made-for-each-other.png'
  ];

  const randomIndex = getRandomInteger(0, posters.length - 1);

  return posters[randomIndex];
};

const generateAgeRating = () => {
  const ratings = ['0+', '3+', '6+', '12+', '16+', '18+'];
  const randomIndex = getRandomInteger(0, ratings.length - 1);
  return ratings[randomIndex];
};

const generateDirector = () => {
  const directors = [
    'Antonio Lane',
    'Valerie Jackson',
    'William Brown',
    'Donald Jimenez',
    'George Anderson',
    'Deborah Ryan',
    'Claudia Jenkins',
    'Yolanda Tyler',
    'Kelly Massey',
    'Randy Smith',
  ];
  const randomIndex = getRandomInteger(0, directors.length - 1);
  return directors[randomIndex];
};

const generateWriters = () => {
  const writers = [
    'John Holmes',
    'Kenneth Craig',
    'John Clark',
    'Laura Long',
    'Nicholas Willis',
    'Robert Sharp',
    'Michael Barnett',
    'Lauren Moore',
    'Joseph Moran',
    'Matthew Coleman'
  ];

  const randomStartIndex = getRandomInteger(0, Math.floor((writers.length - 1) / 2) - 1);
  const randomEndIndex = getRandomInteger(Math.floor((writers.length - 1) / 2) + 1, writers.length - 1);
  return writers.slice(randomStartIndex, randomEndIndex);
};

const generateCountry = () => {
  const countries = [
    'Russia',
    'Finland',
    'USA',
    'Canada',
    'France',
    'Germany',
    'Austria',
    'Spain',
    'Italia',
    'China'
  ];

  const randomIndex = getRandomInteger(0, countries.length - 1);
  return countries[randomIndex];
};

const generateGenre = () => {
  const genres = [
    'action',
    'adventure',
    'comedy',
    'drama',
    'fantasy',
    'historical',
    'horror',
    'western'
  ];

  const randomIndex = getRandomInteger(0, genres.length - 1);
  return [genres[randomIndex]];
};

const generateDescription = () => 'Lorem ipsum odor amet, consectetuer adipiscing elit. Ipsum tincidunt ac aliquet tempor placerat purus curabitur ornare. Dis a scelerisque hac sit sagittis. Praesent sagittis lobortis libero mattis semper; duis suscipit massa? Augue euismod torquent turpis, nisi curabitur vulputate. Odio volutpat justo magna venenatis dapibus. Vivamus fermentum venenatis natoque pulvinar mi elementum dignissim. Sagittis rutrum tristique felis sociosqu ornare duis elit.';

const generateFilm = () => ({
  title: generateTitles(),
  alternateTitle: generateTitles(),
  totalRating: generateRating(),
  poster: generatePoster(),
  ageRating: generateAgeRating(),
  director: generateDirector(),
  writers: generateWriters(),
  actors: generateWriters(),
  release: {
    date: getDate(),
    releaseCountry: generateCountry()
  },
  runtime: getRandomInteger(60, 120),
  genre: generateGenre(),
  description: generateDescription(),
});

export const generateFilms = () => {
  const films = Array.from({length: 14}, generateFilm);

  let totalComments = 0;

  return films.map((film, i) => {
    const commentsAmount = getRandomInteger(0, 5);
    totalComments += commentsAmount;
    return {
      id: String(i + 1),
      comments: Array.from({length: commentsAmount}, (_value, index) => String(totalComments - index)),
      filmInfo: film,
      userDetails: generateUserDetails()
    };
  });
};
