// 'use strict';

const dB = JSON.parse(localStorage.getItem('awito')) || [];

let counter = dB.length;

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
	modalImageItem = document.querySelector('.modal__image-item'),
	modalHeaderItem = document.querySelector('.modal__header-item'),
	modalStatusItem = document.querySelector('.modal__status-item'),
	modalDescriptionItem = document.querySelector('.modal__description-item'),
	modalCostItem = document.querySelector('.modal__cost-item'),
	searchInput = document.querySelector('.search__input'),
	menuContainer = document.querySelector('.menu__container');

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

const renderCard = (DB = dB) => {
	catalog.textContent = '';

	DB.forEach(item => {
		catalog.insertAdjacentHTML('beforeend', `
			<li class="card" data-id-item="${item.id}">
				<img class="card__image" src="data:image/jpeg;base64,${item.image}" alt="test">
				<div class="card__description">
					<h3 class="card__header">${item.nameItem}</h3>
					<div class="card__price">${item.costItem}</div>
				</div>
			</li>
		`);
	});
};

searchInput.addEventListener('input', () => {

	const valueSearch = searchInput.value.trim().toLowerCase();
	if (valueSearch.length > 2) {
		const result = dB.filter(item => item.nameItem.toLowerCase().includes(valueSearch) ||
															item.descriptionItem.toLowerCase().includes(valueSearch));
		renderCard(result);
	}

});

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
		itemObj.id = counter++;
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
	const card = target.closest('.card');

	if (target.closest('.card')) {
		const item = dB.find(obj => obj.id === +card.dataset.idItem);

		modalImageItem.src = `data:image/jpeg;base64,${item.image}`;
		modalHeaderItem.textContent = item.nameItem;
		modalStatusItem.textContent = item.status === 'new' ? 'Новый' : 'Б/У';
		modalDescriptionItem.textContent = item.descriptionItem;
		modalCostItem.textContent = item.costItem;

		modalItem.classList.remove('hide');
		document.addEventListener('keydown', closeModal);
	}
});

menuContainer.addEventListener('click', event => {
	const target = event.target;

	if (target.tagName === 'A') {
		const result = dB.filter(item => item.category === target.dataset.category);
		renderCard(result);
	}

});

modalAdd.addEventListener('click', closeModal);
modalItem.addEventListener('click', closeModal);

renderCard();
