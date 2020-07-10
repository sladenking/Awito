// 'use strict';

const dB = JSON.parse(localStorage.getItem('awito')) || [];

const modalAdd = document.querySelector('.modal__add'),
	addAd = document.querySelector('.add__ad'),
	modalBtnSubmit = document.querySelector('.modal__btn-submit'),
	modalSubmit = document.querySelector('.modal__submit'),
	modalItem = document.querySelector('.modal__item'),
	catalog = document.querySelector('.catalog'),
	modalBtnWarning = document.querySelector('.modal__btn-warning'),
	modalFileInput = document.querySelector('.modal__file-input'),
	modalFileBtn = document.querySelector('.modal__file-btn'),
	modalImageAdd = document.querySelector('.modal__image-add'),
	modalContent = document.querySelector('.modal__content');

const textFileBtn = modalFileBtn.textContent,
	srcModalImg = modalImageAdd.src;

const elemsModalSubmit = [...modalSubmit.elements].filter(elem => elem.tagName !== 'BUTTON');

const infoPhoto = {};

const saveDb = () => localStorage.setItem('awito', JSON.stringify(dB));

const checkForm = () => {
	const validForm = elemsModalSubmit.every(elem => elem.value);
	modalBtnSubmit.disabled = !validForm;
	modalBtnWarning.style.display = validForm ? 'none' : '';
};

const closeModal = event => {
	const target = event.target;

	if (target.classList.contains('modal__close') ||
	target.classList.contains('modal') ||
	event.code === 'Escape') {
		modalAdd.classList.add('hide');
		modalItem.classList.add('hide');
		modalSubmit.reset();
		modalImageAdd.src = srcModalImg;
		modalFileBtn.textContent = textFileBtn;
		document.removeEventListener('keydown', closeModal);
		checkForm();
	}
};

const renderCard = () => {
	catalog.textContent = '';

	dB.forEach((item, i) => {
		catalog.insertAdjacentHTML('beforeend', `
			<li class="card" data-id="${i}">
				<img class="card__image" src="data:image/jpeg;base64,${item.image}" alt="test">
				<div class="card__description">
					<h3 class="card__header">${item.nameItem}</h3>
					<div class="card__price">${item.costItem}</div>
				</div>
			</li>
		`);
	});
};



modalFileInput.addEventListener('change', event => {
	const target = event.target;

	const reader = new FileReader();

	const file = target.files[0];

	infoPhoto.filename = file.name;
	infoPhoto.size = file.size;

	reader.readAsBinaryString(file);

	reader.addEventListener('load', event => {
		if (infoPhoto.size < 200000) {
			modalFileBtn.textContent = infoPhoto.filename;
			infoPhoto.base64 = btoa(event.target.result);
			modalImageAdd.src = `data:image/jpeg;base64,${infoPhoto.base64}`;
		} else {
			modalFileBtn.textContent = 'Файл не должен превышать 200 кБ';
			modalFileInput.value = '';
			checkForm();
		}
	});

});

modalSubmit.addEventListener('input', checkForm);

modalSubmit.addEventListener('submit', event => {
	event.preventDefault();

	const itemObj = {};
	for (const elem of elemsModalSubmit) {
		itemObj[elem.name] = elem.value;
	}
	itemObj.image = infoPhoto.base64;
	dB.push(itemObj);
	closeModal({ target: modalAdd });
	saveDb();
	renderCard();
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

renderCard();

