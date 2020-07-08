'use strict';

const modalAdd = document.querySelector('.modal__add'),
  addAd = document.querySelector('.add__ad'),
  modalBtnSubmit = document.querySelector('.modal__btn-submit'),
  modalSubmit = document.querySelector('.modal__submit'),
  modalItem = document.querySelector('.modal__item');


document.addEventListener('click', event => {
  const target = event.target;

  if (target.classList.contains('add__ad')){
    modalAdd.classList.remove('hide');
    modalBtnSubmit.disabled = true;
  }
  if (target.closest('.card')) {
    modalItem.classList.remove('hide');
  }
  if (target.classList.contains('modal__close') || target === modalItem) {
    modalItem.classList.add('hide');
  }
  if (target.classList.contains('modal__close') || target === modalAdd) {
    modalAdd.classList.add('hide');
    modalSubmit.reset();
  }

});



document.addEventListener('keydown', () => {
  if (event.keyCode === 27) {
      modalAdd.classList.add('hide');
      modalItem.classList.add('hide');
  }
});