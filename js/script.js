
import galleryData from './gallery-items.js';

const refs = {
  galleryList: document.querySelector('.js-gallery'),
  backdrop: document.querySelector('.lightbox'),
  backdropOverlay: document.querySelector('.lightbox__overlay'),
  backdropContent: document.querySelector('.lightbox__content'),
  closeModalBtn: document.querySelector(
    '.lightbox button[data-action="close-lightbox"]',
  ),
  imageInModalWindow: document.querySelector('.lightbox__image'),
};

const GALLERY_ITEM_CLASS = 'gallery__item';
const GALLERY_LINK_CLASS = 'gallery__link';
const GALLERY_IMAGE_CLASS = 'gallery__image';

const createGalleryMarkup = obj => {
  return obj.reduce(
    (acc, { preview, original, description }) =>
      acc +
      `<li class="${GALLERY_ITEM_CLASS}"><a class="${GALLERY_LINK_CLASS}" href="${original}"><img class="${GALLERY_IMAGE_CLASS}" src="${preview}" alt="${description}" data-source="${original}"></a></li>`,
    '',
  );
};

const galleryMarkup = createGalleryMarkup(galleryData);

refs.galleryList.insertAdjacentHTML('beforeend', galleryMarkup);

refs.galleryItem = document.querySelector('.gallery__item');
refs.galleryImage = document.querySelector('.gallery__image');

refs.galleryList.addEventListener('click', onGalleryImageClick);

function onGalleryImageClick(event) {
  event.preventDefault();
  const target = event.target;
  const targetItem = target.closest(`.${GALLERY_ITEM_CLASS}`);

  if (target.nodeName !== 'IMG') return;

  refs.backdrop.classList.add('is-open');

  window.addEventListener('keydown', onKeyPressOnOpenModal);

  setModalImageSource(target);
  targetItem.classList.add('image-in-modal');
}

function setModalImageSource(el) {
  refs.imageInModalWindow.src = el.dataset.source;
  refs.imageInModalWindow.alt = el.alt;
}

refs.closeModalBtn.addEventListener('click', onCloseModal);

function onCloseModal(event) {
  refs.backdrop.classList.remove('is-open');
  refs.imageInModalWindow.src = '';

  refs.galleryList
    .querySelectorAll('.gallery__item')
    .forEach(el => el.classList.remove('image-in-modal'));

  removeKeyListeners();
}

function removeKeyListeners() {
  window.removeEventListener('keydown', onEscKeyPress);
  window.removeEventListener('keydown', onRightArrowPress);
  window.removeEventListener('keydown', onLeftArrowPress);
}

refs.backdropContent.addEventListener('click', onBackdropClick);

function onBackdropClick(event) {
  if (event.target !== refs.imageInModalWindow) {
    onCloseModal();
  }
}

function onKeyPressOnOpenModal(e) {
  const ESC_KEY_CODE = 'Escape';
  const RIGHT_ARROW_KEY_CODE = 'ArrowRight';
  const LEFT_ARROW_KEY_CODE = 'ArrowLeft';

  const isEsc = ESC_KEY_CODE === e.code;
  if (isEsc) {
    onCloseModal();
  }

  if (e.code === RIGHT_ARROW_KEY_CODE) {
    const currentItem = document.querySelector('.image-in-modal');
    if (currentItem === refs.galleryList.lastElementChild) return;
    const nextItem = currentItem.nextElementSibling;
    changeImage(currentItem, nextItem);
  }

  if (e.code === LEFT_ARROW_KEY_CODE) {
    const currentItem = document.querySelector('.image-in-modal');
    if (currentItem === refs.galleryList.firstElementChild) return;
    const nextItem = currentItem.previousElementSibling;
    changeImage(currentItem, nextItem);
  }
}

function changeImage(currActiveItem, nextActiveItem) {
  const nextImage = nextActiveItem.querySelector('.gallery__image');
  setModalImageSource(nextImage);
  currActiveItem.classList.remove('image-in-modal');
  nextActiveItem.classList.add('image-in-modal');
}