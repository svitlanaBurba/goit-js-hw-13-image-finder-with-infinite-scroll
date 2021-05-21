import imagesTpl from './templates/imagesTpl.hbs';
import './sass/main.scss';
import ImagesApiService from './services/apiService';
import Anchor from './components/anchor.js';
import './components/button-up.js';

import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/src/styles/main.scss';

import { error } from '@pnotify/core/dist/PNotify.js';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';

const refs = {
  searchForm: document.querySelector('.js-search-form'),
  galleryContainer: document.querySelector('.js-gallery-container'),
};
const anchor = new Anchor({
  selector: '[data-action="load-more"]',
  hidden: true,
});
const imagesApiService = new ImagesApiService();

refs.searchForm.addEventListener('submit', onSearch);

function onSearch(e) {
  e.preventDefault();

  imagesApiService.query = e.currentTarget.elements.query.value;

  if (imagesApiService.query === '') {
    return error({ delay: 2500, text: 'Enter something...' });
  }

  imagesApiService.resetPage();
  clearImagesContainer();
  fetchImages();
}

const observer = new IntersectionObserver(onItemIntersect, {});

function onItemIntersect([entry], observer) {
  if (entry.isIntersecting) {
    console.log('Intersected');
    fetchImages();
  }

  if (imagesApiService.page >= imagesApiService.lastPage) {
    observer.disconnect();
  }
}
observer.observe(anchor.refs.anchor);

function fetchImages() {
  anchor.hide();

  imagesApiService.fetchImages().then(images => {
    // console.log(images);
    if (images.length === 0) {
      if (refs.galleryContainer.innerHTML === '') {
        return error({ delay: 2500, text: 'Enter something realistic...' });
      } else {
        return;
      }
    }
    appendImagesMarkup(images);
    anchor.show();
  });
}

function appendImagesMarkup(images) {
  refs.galleryContainer.insertAdjacentHTML('beforeend', imagesTpl(images));
}

function clearImagesContainer() {
  refs.galleryContainer.innerHTML = '';
}

refs.galleryContainer.addEventListener('click', event => {
  const instance = basicLightbox.create(
    `
<img width="800" height="600" src="${event.target.dataset['img']}">
	`,
  );
  instance.show();
});

{
  /* When the user clicks on the button, scroll to the top of the document */
}
// function topFunction() {
//   document.body.scrollTop = 0;
//   document.documentElement.scrollTop = 0;
// }
