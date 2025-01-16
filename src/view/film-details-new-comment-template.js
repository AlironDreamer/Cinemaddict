const createChosenEmojiLabel = (checkedEmotion) => {
  const emojiImg = checkedEmotion
    ? `<img src="./images/emoji/${checkedEmotion}.png" width="55" height="55" alt="emoji">`
    : '';
  return `
    <div class="film-details__add-emoji-label">
        ${emojiImg}
    </div>
  `;
};

const createEmojiItem = (emotion, checkedEmotion) => {
  return `
    <input
        class="film-details__emoji-item visually-hidden"
        name="comment-emoji"
        type="radio"
        id="emoji-${emotion}"
        value="${emotion}"
        ${emotion === checkedEmotion ? 'checked' : ''}
    >
     <label
        class="film-details__emoji-label"
        for="emoji-${emotion}"
     >
        <img
            src="./images/emoji/${emotion}.png"
            width="30"
            height="30"
            alt="emoji"
        >
     </label>
  `;
};

export const createFilmDetailsNewCommentTemplate = (emotions, checkedEmotion, comment, isDisabled) =>
  `<form class="film-details__new-comment" action="" method="get" ${isDisabled ? 'style="opacity: 20%" disabled' : ''}>
          ${createChosenEmojiLabel(checkedEmotion)}

          <label class="film-details__comment-label">
            <textarea
                class="film-details__comment-input"
                placeholder="Select reaction below and write comment here"
                name="comment"
                ${isDisabled ? 'disabled' : ''}
            >${(comment) ? comment : ''}</textarea>
          </label>

          <div class="film-details__emoji-list">
            ${emotions.map((emotion) => createEmojiItem(emotion, checkedEmotion)).join('')}
          </div>
  </form>`;
