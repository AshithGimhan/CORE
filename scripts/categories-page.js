import { activeNavLinks } from "./hamburger.js";
import { getTransactions } from "./transactions.js";
import { hasErrors } from "./utils.js";


//DOM
const addCategoryBtn = document.querySelector('.js-add-category-btn');
const categoryNameElement = document.querySelector('.js-category-name');
const transactionDropdownElement = document.querySelector('.js-transaction-dropdown');
const categoryErrorMsgElement = document.querySelector('.js-category-error-msg');
const typeErrorMsgElement = document.querySelector('.js-type-error-msg');
const colorPickerOpenBtn = document.getElementById('openBtn');
const colorPickerCloseBtn = document.getElementById('closeBtn');
const popUpElement = document.querySelector('.js-popup')
const swatches = document.querySelectorAll('.swatch')
const swatchConfirmBtn = document.querySelector('.js-swatch-confirm-btn')
const colorChangeElemet = document.querySelector('.color-picker-container')
const removeColorBtn = document.querySelector('.js-remove-color')


//EVENT LISTENERS
addCategoryBtn.addEventListener('click', e => {
    handleAddCategories();
    console.log(categoriesList)

})

colorPickerOpenBtn.addEventListener('click', e => {
    popUpElement.classList.add('visible')
});

colorPickerCloseBtn.addEventListener('click', e => {
    popUpElement.classList.remove('visible')

    swatches.forEach(btn => {
        btn.classList.remove('active');
    });
});

swatches.forEach(swatch => {
    swatch.style.backgroundColor = swatch.dataset.color
});

swatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
        swatchColor = swatch.dataset.color

        swatches.forEach(btn => {
            btn.classList.remove('active');
        });

        swatch.classList.add('active');
        colorChangeElemet.style.color = swatchColor

        confirmBtnChange(swatchColor)
    });
})

swatchConfirmBtn.addEventListener('click', event => {

    popUpElement.classList.remove('visible')
    removeColorBtn.classList.add('remove-color-visible')

})

removeColorBtn.addEventListener('click', event => {
    swatchColor = '#000000'
    colorChangeElemet.style.color = ''

    swatches.forEach(btn => {
        btn.classList.remove('active');
    });
    removeColorBtn.classList.remove('remove-color-visible')

});

function confirmBtnChange(swatchColor) {
    swatchConfirmBtn.addEventListener('mouseover', e => {
        const datasetColor = swatchColor

        e.target.style.backgroundColor = datasetColor;
    })

    swatchConfirmBtn.addEventListener('mouseout', e => {
        e.target.style.backgroundColor = '#fff';
    })

}


//DATA
const transactions = getTransactions();
let categoriesList = JSON.parse(localStorage.getItem('categories'))
let swatchColor = '#000000';

//INITIALIZE
activeNavLinks();
if (!localStorage.getItem("categories")) {
    localStorage.setItem("categories", JSON.stringify(categoriesList))
}


//FUNCTIONS
function getCategoryData() {
    const nextId = categoriesList.length === 0 ? 1 : categoriesList[categoriesList.length - 1].id + 1

    let categoryName = categoryNameElement.value;

    return {
        id: nextId,
        category: categoryNameElement.value.toLowerCase(),
        type: transactionDropdownElement.value,
        transactions: getTransactionCountByCategory(categoryName),
        color: swatchColor
    }
}

function clearInputs() {
    categoryNameElement.value = '';
    transactionDropdownElement.value = 'default';
}

function getTransactionCountByCategory(category) {
    let count = 0

    transactions.forEach(t => {
        if (t.categoryType === category) {
            count++
        }
    });

    return count
}

function handleAddCategories() {
    const categories = getCategoryData();
    const errors = handleValidation(categories);

    showErrors(errors)
    if (hasErrors(errors)) return;

    categoriesList.push(categories)

    localStorage.setItem("categories", JSON.stringify(categoriesList))

    clearInputs()
}

function handleValidation(categories) {
    const errors = {
        category: '',
        type: ''
    }

    if (categories.category.trim() === '') {
        errors.category = 'Category name is required'
    }

    if (categories.type === 'default') {
        errors.type = 'Transaction type is required'
    }

    if(categories.category === 'food') {
        errors.category = 'Category already exists'
    }

    categoriesList.forEach(category => {
        if (categoriesList.category === categories.category) {
            errors.category = 'Category already exists'
        }
    })

    return errors
}

function showErrors(errors) {
    categoryErrorMsgElement.innerHTML = errors.category
    typeErrorMsgElement.innerHTML = errors.type

    errorMsgTimeout()
}

function errorMsgTimeout() {
    const intervalId = setInterval(() => {
        categoryErrorMsgElement.innerHTML = ''
        typeErrorMsgElement.innerHTML = ''
    }, 3000)
}