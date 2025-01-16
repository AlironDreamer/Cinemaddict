import FilmsPresenter from './presenter/films-presenter.js';
import FilmsModel from './model/films-model.js';
import CommentsModel from './model/comments-model.js';
import CategoryModel from './model/category-model.js';
import CategoryPresenter from './presenter/category-presenter.js';
import FilmsApiService from './api-services/films-api-service.js';
import FooterStatsPresenter from './presenter/footer-stats-presenter.js';
import HeaderUserPresenter from './presenter/header-user-presenter.js';
import CommentsApiService from './api-services/comments-api-service.js';

const AUTHORIZATION = 'Basic cn23uihno290km';
const END_POINT = 'https://17.ecmascript.htmlacademy.pro/cinemaddict/';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');

const filmsModel = new FilmsModel(new FilmsApiService(END_POINT, AUTHORIZATION));
const commentsModel = new CommentsModel(new CommentsApiService(END_POINT, AUTHORIZATION), filmsModel);
const categoryModel = new CategoryModel();
const headerUserPresenter = new HeaderUserPresenter(siteHeaderElement, filmsModel);
const filmsPresenter = new FilmsPresenter(siteMainElement, filmsModel, commentsModel, categoryModel);
const categoryPresenter = new CategoryPresenter(siteMainElement, categoryModel, filmsModel);
const footerStatsPresenter = new FooterStatsPresenter(siteFooterElement, filmsModel);

headerUserPresenter.init();
categoryPresenter.init();
filmsPresenter.init();
footerStatsPresenter.init();
filmsModel.init();

