import { mixArrayElements, createDebouncedFunction } from './util.js';
import { renderMiniaturePictures, deletePictures } from './miniatures.js';

const COUNT_OF_FILTERS = 10;
const ACTIVE_BUTTON_CLASS = 'img-filters__button--active';

const imgFiltersElement = document.querySelector('.img-filters');
const imgFiltersFormElement = imgFiltersElement.querySelector('.img-filters__form');

const isButtonElement = (evt) => evt.target.tagName === 'BUTTON';

let photoList = [];

document.addEventListener('photosLoaded', (evt) => {
  photoList = evt.detail;
});

const applyFilterToPhotos = (filterId) => {
  switch (filterId) {
    case 'filter-random':
      return mixArrayElements(photoList).slice(0, COUNT_OF_FILTERS);
    case 'filter-discussed':
      return photoList.slice().sort((firstPhoto, secondPhoto) => secondPhoto.comments.length - firstPhoto.comments.length);
    case 'filter-default':
    default:
      return photoList.slice();
  }
};

const onImgFiltersFormClick = createDebouncedFunction((evt) => {
  if (isButtonElement(evt)) {
    deletePictures();
    const filteredPhotos = applyFilterToPhotos(evt.target.id);
    renderMiniaturePictures(filteredPhotos);
  }
});

const onButtonClick = (evt) => {
  if (isButtonElement(evt)) {
    const activeButton = imgFiltersFormElement.querySelector(`.${ACTIVE_BUTTON_CLASS}`);
    if (activeButton) {
      activeButton.classList.remove(ACTIVE_BUTTON_CLASS);
    }
    evt.target.classList.add(ACTIVE_BUTTON_CLASS);
  }
};

imgFiltersFormElement.addEventListener('click', onImgFiltersFormClick);
imgFiltersFormElement.addEventListener('click', onButtonClick);

