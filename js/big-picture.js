import { determineCommentEnding } from './util.js';

const COMMENTS_STEP = 5;

const elements = {
  bigPicture: document.querySelector('.big-picture'),
  bigPictureImg: document.querySelector('.big-picture__img img'),
  likesCount: document.querySelector('.likes-count'),
  commentsCount: document.querySelector('.comments-count'),
  socialCommentsList: document.querySelector('.social__comments'),
  socialCaption: document.querySelector('.social__caption'),
  closeButton: document.querySelector('#picture-cancel'),
  commentCountBlock: document.querySelector('.social__comment-count'),
  commentsLoader: document.querySelector('.comments-loader'),
};

let commentsToRender = [];
let shownCommentsCount = 0;

function closeImagePreview() {
  elements.bigPicture.classList.add('hidden');
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', handleEscPress);
  commentsToRender = [];
  shownCommentsCount = 0;
}

function handleEscPress(event) {
  if (event.key === 'Escape') {
    closeImagePreview();
  }
}

function generateCommentElement(comment) {
  const listItem = document.createElement('li');
  listItem.classList.add('social__comment');

  const avatar = document.createElement('img');
  avatar.classList.add('social__picture');
  avatar.src = comment.avatar;
  avatar.alt = comment.name;
  avatar.width = 35;
  avatar.height = 35;

  const text = document.createElement('p');
  text.classList.add('social__text');
  text.textContent = comment.message;

  listItem.appendChild(avatar);
  listItem.appendChild(text);

  return listItem;
}

function updateCommentList() {
  const fragment = document.createDocumentFragment();
  const newComments = commentsToRender.slice(shownCommentsCount, shownCommentsCount + COMMENTS_STEP);

  newComments.forEach((comment) => {
    const commentElement = generateCommentElement(comment);
    fragment.appendChild(commentElement);
  });

  elements.socialCommentsList.appendChild(fragment);
  shownCommentsCount += newComments.length;

  elements.commentCountBlock.textContent = `${shownCommentsCount} из ${commentsToRender.length} ${determineCommentEnding(commentsToRender.length)}`;
  if (shownCommentsCount >= commentsToRender.length || commentsToRender.length < COMMENTS_STEP) {
    elements.commentsLoader.classList.add('hidden');
  } else {
    elements.commentsLoader.classList.remove('hidden');
  }
}

function showImagePreview(photo) {
  if (!photo) {
    return;
  }
  elements.bigPictureImg.src = photo.url ?? '';
  elements.bigPictureImg.alt = photo.description ?? '';
  elements.likesCount.textContent = photo.likes ?? 0;
  elements.commentsCount.textContent = photo.comments?.length ?? 0;
  elements.socialCaption.textContent = photo.description;
  elements.socialCommentsList.innerHTML = '';
  commentsToRender = photo.comments;
  shownCommentsCount = 0;
  updateCommentList();
  elements.commentCountBlock.classList.remove('hidden');
  elements.bigPicture.classList.remove('hidden');
  document.body.classList.add('modal-open');
  document.addEventListener('keydown', handleEscPress);
}

elements.closeButton.addEventListener('click', closeImagePreview);
elements.commentsLoader.addEventListener('click', updateCommentList);

export { showImagePreview };
