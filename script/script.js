'use strict';

const dB = [];

const modalAdd = document.querySelector('.modal__add'),
	addAd = document.querySelector('.add__ad'),
	modalBtnSubmit = document.querySelector('.modal__btn-submit'),
	modalSubmit = document.querySelector('.modal__submit'),
	modalItem = document.querySelector('.modal__item'),
	catalog = document.querySelector('.catalog'),
	modalBtnWarning = document.querySelector('.modal__btn-warning');

const elemsModalSubmit = [...modalSubmit.elements].filter(elem => elem.tagName !== 'BUTTON');

const checkForm = () => {
	const validForm = elemsModalSubmit.every(elem => elem.value)
	modalBtnSubmit.disabled = !validForm;
	modalBtnWarning.style.display = validForm ? 'none' : '';
};

const closeModal = event => {
	const target = event.target;

	if (target.classList.contains('modal__close') || target.classList.contains('modal') || event.code === 'Escape') {
		modalAdd.classList.add('hide');
		modalItem.classList.add('hide');
		modalSubmit.reset();
		document.removeEventListener('keydown', closeModal);
		checkForm();
	}
};

modalSubmit.addEventListener('input', checkForm);

modalSubmit.addEventListener('submit', event => {
	event.preventDefault();
	
	const itemObj = {};
	for (const elem of elemsModalSubmit) {
		itemObj[elem.name] = elem.value;
	}
	dB.push(itemObj);
	modalSubmit.reset();
	closeModal({target: modalAdd});

});

addAd.addEventListener('click', () => {
	modalAdd.classList.remove('hide');
	modalBtnSubmit.disabled = true;
	document.addEventListener('keydown', closeModal);
});

catalog.addEventListener('click', event => {
	const target = event.target;
	if (target.closest('.card')) {
		modalItem.classList.remove('hide');
		document.addEventListener('keydown', closeModal);
	}
});

modalAdd.addEventListener('click', closeModal);
modalItem.addEventListener('click', closeModal);