const VALIDATION_RULES = {
  MAX_COMMENT_LENGTH: 140,
  MAX_HASHTAG_COUNT: 5,
  HASHTAG_PATTERN: /^#[A-Za-z0-9А-Яа-я]{1,19}$/,
};

export const form = document.querySelector('.img-upload__form');
export const hashtagsInputElement = document.querySelector('.text__hashtags');
export const descriptionInputElement = document.querySelector('.text__description');

export const pristineValidator = new Pristine(form, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
});

const isDescriptionValid = (value) => !value || value.length <= VALIDATION_RULES.MAX_COMMENT_LENGTH;

const isHashtagsValidParts = (value) => {
  if (value.trim() === '') {
    return { isCorrectCount: true, isUniqueHashtag: true, isValidHashtag: true };
  }

  const hashtags = value.trim().split(/\s+/).map((hashtag) => hashtag.toLowerCase());

  const isCorrectCount = hashtags.length <= VALIDATION_RULES.MAX_HASHTAG_COUNT;
  const isUniqueHashtag = new Set(hashtags).size === hashtags.length;
  let isValidHashtag = true;
  for (const hashtag of hashtags) {
    if (!VALIDATION_RULES.HASHTAG_PATTERN.test(hashtag)) {
      isValidHashtag = false;
      break;
    }
  }

  return { isCorrectCount, isUniqueHashtag, isValidHashtag };
};

const isHashtagsValid = (value) => {
  const { isCorrectCount, isUniqueHashtag, isValidHashtag } = isHashtagsValidParts(value);
  return isCorrectCount && isUniqueHashtag && isValidHashtag;
};

const getHashtagErrorMessage = (value) => {
  const { isCorrectCount, isUniqueHashtag, isValidHashtag } = isHashtagsValidParts(value);
  if (!isCorrectCount) {
    return 'Нельзя указывать больше 5 хеш-тегов';
  }

  if (!isUniqueHashtag) {
    return 'Хеш-теги не могут повторяться';
  }

  if (!isValidHashtag) {
    return 'Неправильный формат хеш-тега';
  }
};

pristineValidator.addValidator(hashtagsInputElement, isHashtagsValid, getHashtagErrorMessage);
pristineValidator.addValidator(descriptionInputElement, isDescriptionValid, 'Комментарий не должен превышать 140 символов');
