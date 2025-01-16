export const createFilmDetailsLoadingError = () =>
  `<div class="film-details__loading-error-wrapper">
    <div class="film-details__loading-error-container">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.2 18.47 10.16 4c.74-1.35 2.94-1.35 3.68 0l7.96 14.46c.64 1.17-.34 2.53-1.84 2.53H4.04c-1.5 0-2.48-1.36-1.84-2.53ZM12 9v4M12 17.02V17" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <p class="film-details__loading-error-text">Произошла ошибка при загрузке комментариев, откройте страницу позднее...</p>
    </div>
  </div>`;
