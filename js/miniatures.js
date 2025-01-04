import { showImagePreview } from './big-picture.js';

const PICTURE_CONTAINER = document.querySelector('.pictures');
const PICTURE_TEMPLATE = document.querySelector('#picture').content.querySelector('.picture');
const IMG_FILTERS_SECTION = document.querySelector('.img-filters');

const createMiniaturePicture = (photoData) => {
  const pictureElement = PICTURE_TEMPLATE.cloneNode(true);
  const image = pictureElement.querySelector('.picture__img');
  const likesCount = pictureElement.querySelector('.picture__likes');
  const commentsCount = pictureElement.querySelector('.picture__comments');

  image.src = photoData.url;
  image.alt = photoData.description;
  likesCount.textContent = photoData.likes;
  commentsCount.textContent = photoData.comments.length;

  pictureElement.addEventListener('click', (event) => {
    event.preventDefault();
    showImagePreview(photoData);
  });

  return pictureElement;
};

const renderMiniaturePictures = (photosData) => {
  const fragment = document.createDocumentFragment();

  photosData.forEach((photoData) => {
    const pictureElement = createMiniaturePicture(photoData);
    fragment.appendChild(pictureElement);
  });

  PICTURE_CONTAINER.appendChild(fragment);
  IMG_FILTERS_SECTION.classList.remove('img-filters--inactive');
};

const deletePictures = () => {
  const miniaturePictures = Array.from(PICTURE_CONTAINER.getElementsByClassName('picture'));

  miniaturePictures.forEach((photoElement) => photoElement.remove());
};

export { renderMiniaturePictures, deletePictures };
