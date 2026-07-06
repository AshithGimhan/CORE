import { activeNavLinks } from "./hamburger.js";
import { getTransactions } from "./transactions.js";
import { hasErrors } from "./utils.js";


//DOM
const addCategoryBtn = document.querySelector('.js-add-category-btn');
const categoryNameElement = document.querySelector('.js-category-name');
const transactionDropdownElement = document.querySelector('.js-transaction-dropdown');
const categoryErrorMsgElement = document.querySelector('.js-category-error-msg');
const typeErrorMsgElement = document.querySelector('.js-type-error-msg');
const colorPickerElement = document.querySelector('.js-color-picker');

//EVENT LISTENERS
addCategoryBtn.addEventListener('click', e => {
    handleAddCategories();
    console.log(categoriesList)

})


//DATA
const transactions = getTransactions();
let categoriesList = JSON.parse(localStorage.getItem('categories'))



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
        color: colorPickerElement.value
    }
}

function clearInputs() {
    categoryNameElement.value = '';
    transactionDropdownElement.value = 'default';
    colorPickerElement.value = '#000000';
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