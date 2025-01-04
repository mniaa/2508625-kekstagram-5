import { form, pristineValidator, hashtagsInputElement, descriptionInputElement } from './rules.js';
import { unloadData } from './api.js';

const BASE_SCALE = 100;

const bodyElement = document.body;
const imageInputElement = document.querySelector('.img-upload__input');
const uploadOverlayElement = document.querySelector('.img-upload__overlay');
const cancelButtonElement = document.querySelector('.img-upload__cancel');
export const uploadPreview = document.querySelector('.img-upload__preview img');

const effectLevelSliderElement = document.querySelector('.effect-level__slider');
const effectLevelContainerElement = document.querySelector('.img-upload__effect-level');
const scaleControlValueElement = document.querySelector('.scale__control--value');
const isEscapeKeyPressed = (event) => event.key === 'Escape';
const getMessageElement = () => document.querySelector('.success, .error');

const updateImageScale = (scaleValue) => {
  scaleControlValueElement.value = `${scaleValue}%`;
  uploadPreview.style.transform = `scale(${scaleValue / 100})`;
};

const resetAllEffects = () => {
  document.querySelector('#effect-none').checked = true;
  uploadPreview.style.filter = '';
  effectLevelContainerElement.classList.add('hidden');
  effectLevelSliderElement.noUiSlider.set(0);

  updateImageScale(BASE_SCALE);
};

const handleMessageEscKeydown = (event) => {
  if (isEscapeKeyPressed(event) && getMessageElement()) {
    event.preventDefault();
    closeMessageBox();
  }
};

const handleMessageOutsideClick = (event) => {
  const messageElement = getMessageElement();
  if (event.target === messageElement) {
    closeMessageBox();
  }
};

function closeMessageBox() {
  document.removeEventListener('keydown', handleMessageEscKeydown);
  document.removeEventListener('click', handleMessageOutsideClick);
  const messageElement = getMessageElement();
  if (messageElement) {
    messageElement.remove();
  }
}

const handleDocumentKeydown = (event) => {
  const isFocused = [hashtagsInputElement, descriptionInputElement].some((inputElement) => inputElement === event.target);
  if (isEscapeKeyPressed(event) && !getMessageElement() && !isFocused) {
    event.preventDefault();
    closeUploadForm();
  }
};

function closeUploadForm() {
  form.reset();
  pristineValidator.reset();
  resetAllEffects();

  uploadOverlayElement.classList.add('hidden');
  bodyElement.classList.remove('modal-open');
  document.removeEventListener('keydown', handleDocumentKeydown);
}

const openUploadForm = () => {
  uploadOverlayElement.classList.remove('hidden');
  bodyElement.classList.add('modal-open');

  document.addEventListener('keydown', handleDocumentKeydown);
  cancelButtonElement.addEventListener('click', closeUploadForm);
};

const handleImageUpload = () => {
  const selectedFile = imageInputElement.files[0];
  if (selectedFile) {
    const fileReader = new FileReader();

    fileReader.onload = () => {
      uploadPreview.src = fileReader.result;
      document.querySelectorAll('.effects__preview').forEach((previewElement) => {
        previewElement.style.backgroundImage = `url(${fileReader.result})`;
      });
    };

    fileReader.readAsDataURL(selectedFile);
  }
  resetAllEffects();
  openUploadForm();
};

imageInputElement.addEventListener('change', handleImageUpload);


noUiSlider.create(effectLevelSliderElement, {
  range: { min: 0, max: 1 },
  start: 0,
  step: 0.1,
  connect: 'lower',
});

const showMessageModal = (messageType) => {
  const template = document.querySelector(`#${messageType}`).content;
  const messageElement = template.cloneNode(true);
  document.body.append(messageElement);

  const messageButtonElement = document.querySelector(`.${messageType}__button`);
  const messageModalElement = document.querySelector(`.${messageType}`);

  const removeMessage = () => {
    messageModalElement.remove();
    document.removeEventListener('keydown', handleMessageEscKeydown);
  };

  messageModalElement.addEventListener('click', (event) => {
    if (!event.target.closest(`.${messageType}__inner`)) {
      removeMessage();
    }
  });

  messageButtonElement.addEventListener('click', removeMessage);
  document.addEventListener('keydown', handleMessageEscKeydown);
};

form.addEventListener('submit', async (event) => {
  const isFormValid = pristineValidator.validate();
  if (!isFormValid) {
    event.preventDefault();
    return;
  }

  event.preventDefault();

  const formData = new FormData(form);
  const submitButtonElement = form.querySelector('[type="submit"]');
  submitButtonElement.disabled = true;

  try {
    await unloadData(
      () => {
        showMessageModal('success');
        closeUploadForm();
      },
      () => {
        showMessageModal('error');
      },
      'POST',
      formData
    );
  } catch (error) {
    showMessageModal('error');
  } finally {
    submitButtonElement.disabled = false;
  }
});
