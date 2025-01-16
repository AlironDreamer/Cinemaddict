const getRandomInteger = (a, b) => {
  const min = Math.ceil(Math.min(Math.abs(a), Math.abs(b)));
  const max = Math.floor(Math.max(Math.abs(a), Math.abs(b)));
  return Math.floor(Math.random() * (max + 1 - min)) + min;
};

const isEscKeyDown = (evt) => evt.key === 'Escape';
const isUploadKeysDown = (evt) => evt.ctrlKey && evt.key === 'Enter';

const createErrorMessage = (message) => {
  const bannerTemplate = `
    <div class='error-banner error-banner--update'>
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.2 18.47 10.16 4c.74-1.35 2.94-1.35 3.68 0l7.96 14.46c.64 1.17-.34 2.53-1.84 2.53H4.04c-1.5 0-2.48-1.36-1.84-2.53ZM12 9v4M12 17.02V17" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <p class="error-banner__text">${message}</p>
    </div>`;

  document.body.insertAdjacentHTML('afterbegin', bannerTemplate);
  const banner = document.querySelector('.error-banner');
  // Скрываем баннер через 3 секунды
  setTimeout(() => {
    banner.classList.add('error-banner--fade-out');
    banner.addEventListener('transitionend', () => {
      banner.remove();
    }, { once: true });
  }, 3000);
};

export { getRandomInteger, isEscKeyDown, isUploadKeysDown, createErrorMessage};
