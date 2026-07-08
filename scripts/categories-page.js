import { addCategory, createCategory, getCategories, getTotalAmountByCategory, getTransactionCountByCategory } from "./categories.js";
import { activeNavLinks } from "./hamburger.js";
import { getTransactions } from "./transactions.js";
import { hasErrors } from "./utils.js";
import { cancelDeleteForCategory, confirmDeleteForCategory, handleDeleteForCategory } from "./deleteService.js";

//DOM
const addCategoryBtn = document.querySelector('.js-add-category-btn');
const categoryNameElement = document.querySelector('.js-category-name');
const transactionDropdownElement = document.querySelector('.js-transaction-dropdown');
const categoryErrorMsgElement = document.querySelector('.js-category-error-msg');
const typeErrorMsgElement = document.querySelector('.js-type-error-msg');
const colorPickerOpenBtn = document.querySelectorAll('.js-open-btn');
const colorPickerCloseBtn = document.getElementById('closeBtn');
const popUpElement = document.querySelector('.js-popup')
const swatches = document.querySelectorAll('.swatch')
const swatchConfirmBtn = document.querySelector('.js-swatch-confirm-btn')
const colorChangeElemet = document.querySelector('.color-picker-container')
const removeColorBtn = document.querySelector('.js-remove-color')
const categoryListDisplay = document.querySelector('.js-category-list');

//EVENT LISTENERS
addCategoryBtn.addEventListener('click', e => {
    handleAddCategories();

    updateCategoryPage();
    removeColorBtn.classList.remove('remove-color-visible')
    colorChangeElemet.style.color = ''


    console.log(categoriesList)

})

colorPickerOpenBtn.forEach(btn => {
    btn.addEventListener('click', e => {
        popUpElement.classList.add('visible')
    });
})

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

swatchConfirmBtn.addEventListener('mouseover', e => {
    e.target.style.backgroundColor = swatchColor;
})

swatchConfirmBtn.addEventListener('mouseout', e => {
    e.target.style.backgroundColor = '#fff';
})

categoryListDisplay.addEventListener('click', (event) => {
    pendingCategoryDeleteid = handleDeleteForCategory(event)
});

document.querySelector('.js-btn-confirm').addEventListener('click', () => {
    confirmDeleteForCategory(pendingCategoryDeleteid);
    updateCategoryPage();
})
document.querySelector('.js-btn-cancel').addEventListener('click', () => {
    cancelDeleteForCategory();
})

//DATA
const transactions = getTransactions();
let categoriesList = getCategories()
let swatchColor = '#000000';
let pendingCategoryDeleteid;

//INITIALIZE
updateCategoryPage()
activeNavLinks();


//FUNCTIONS
function clearInputs() {
    categoryNameElement.value = '';
    transactionDropdownElement.value = 'default';
}

function handleAddCategories() {
    const categories = createCategory(
        categoryNameElement.value,
        transactionDropdownElement.value,
        swatchColor
    );

    const errors = handleValidation(categories);

    showErrors(errors)
    if (hasErrors(errors)) return;

    addCategory(categories)

    categoriesList = getCategories()

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


    categoriesList.forEach(c => {
        if (c.category === categories.category.trim()) {
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

function renderCategoryList() {
    let categoryHTML = '';

    categoriesList.forEach(category => {
        const sign = category.type === 'income' ? 'earned' : 'spent'
        const transactionColor = category.type === 'income' ? 'green' : 'red';
        const categoryName = category.category.charAt(0).toUpperCase() + category.category.slice(1)

        const count = getTransactionCountByCategory(category.category)
        const amount = getTotalAmountByCategory(category.category)

        categoryHTML += `<div class="category-cards" style="border-left: 4px solid ${category.color};">
              <div class="category-cards-left">
                <h3>${categoryName}</h3>
                <span class="${transactionColor}">$${amount} ${sign}</span>
                <p>${count} transactions</p>
              </div>
              <div class="js-category-id category-cards-right" data-category-id="${category.id}">
                <i class="fa-regular fa-pen-to-square"></i>
                <i class="js-delete-btn ph ph-trash delete-btn"></i>
              </div>
            </div>`
    });

    return categoryHTML;
}

function updateCategoryPage() {
    document.querySelector('.js-category-list').innerHTML = renderCategoryList();
}

