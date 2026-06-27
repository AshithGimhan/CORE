import { formatDate, hasErrors } from "./utils.js";
import {
    getTransactions,
    addTransaction,
    deleteTransactionById,
    getProcessedTransactions,
    transactionPagination,
    getTotalIncome,
    getTotalExpense,
    getNewBalance,
    getTransactionCount
} from "./transactions.js";
import { handlePage, resetPage, getCurrentPage, generatePageNumbers } from "./pagination.js";
import '../scripts/hamburger.js'
import { handleDelete, confirmDelete, cancelDelete } from './deleteService.js'



//DOM ELEMENTS
//HAMBURGER DOM 
const hamburgerBtn = document.querySelector('.js-hamburger-btn');
const hamburgerDisplay = document.querySelector('.js-hamburger-display');
const hamburgerCloseBtn = document.querySelector('.js-ham-close-btn');

//FORM DOM 
const addTransactionBtn = document.querySelector('.js-add-transaction');
const descriptionInput = document.querySelector('.js-description-input');
const amountInput = document.querySelector('.js-amount-input');
const transactionDropdown = document.querySelector('.js-transaction-dropdown');
const categoryDropdown = document.querySelector('.js-category-dropdown');
const dateInput = document.querySelector('.js-date-input');

//ERROR DOM
const descriptionErrorMsg = document.querySelector('.js-description-error');
const amountErrorMsg = document.querySelector('.js-amount-error');
const transactionTypeErrorMsg = document.querySelector('.js-transaction-type-error');
const categoryErrorMsg = document.querySelector('.js-category-error');
const dateErrorMsg = document.querySelector('.js-date-error');

/* DISPLAY DOM */
const totalIncomeDisplay = document.querySelector('.js-income-value');
const totalExpenseDisplay = document.querySelector('.js-expense-value')
const newBalanceDisplay = document.querySelector('.js-balance-value')
const transactionCountDisplay = document.querySelector('.js-transaction-count');

//TRANSACTION DOM
const transactionDisplay = document.querySelector('.js-transaction-list');


//PAGINATION DOM
const pageNumberDisplay = document.querySelector('.js-page-numbers');





//FILTER DOM
const sortOption = document.querySelector('.js-sort');
const filterOption = document.querySelectorAll('.js-filter-btn');
const clearFilterBtn = document.querySelector('.js-clear-filter-sort')


//EVENT LISTENERS
hamburgerBtn.addEventListener('click', () => {
    hamburgerDisplay.classList.add('hamburger-menu-visible');
})

hamburgerCloseBtn.addEventListener('click', () => {
    hamburgerDisplay.classList.remove('hamburger-menu-visible');
})

if (addTransactionBtn) {
    addTransactionBtn.addEventListener('click', () => {
        handleAddTransaction();
    })
}

if (transactionDisplay) {
    transactionDisplay.addEventListener('click', (event) => {
        pendingDeleteId = handleDelete(event)
    })
}

document.querySelector('.js-btn-confirm').addEventListener('click', () => {
    confirmDelete(pendingDeleteId);
    updateDashboard();

})
document.querySelector('.js-btn-cancel').addEventListener('click', () => {
    cancelDelete();
})

pageNumberDisplay.addEventListener('click', (event) => {
    handlePage(event);
    updateDashboard();
});

sortOption.addEventListener('change', (option) => {
    currentSort = option.target.value;
    resetPage();
    clearFilterBtn.classList.add('visible');
    updateDashboard();
})

clearFilterBtn.addEventListener('click', () => {
    currentSort = 'default';
    transactionFilter = 'all';
    sortOption.value = 'default';
    clearFilterBtn.classList.remove('visible');
    resetPage();
    updateDashboard();
});

filterOption.forEach((button) => {
    button.addEventListener('click', () => {
        transactionFilter = button.dataset.filter;
        resetPage();
        clearFilterBtn.classList.add('visible');
        updateDashboard();

        if (transactionFilter === 'all') {
            clearFilterBtn.classList.remove('visible');
        }
    })

});



//STATE
let currentSort = 'default';
let transactionFilter = 'all';
let categoryFilter = 'all'
let pendingDeleteId = null;


const dashboardPage = Boolean(addTransactionBtn)

//INITIALIZE RENDER
if (dashboardPage) {
    updateDashboard();
}


//FORM FUNCTIONS
function getTransactionData() {
    return {
        id: crypto.randomUUID(),
        description: descriptionInput.value,
        amount: Number(amountInput.value),
        transactionType: transactionDropdown.value,
        categoryType: categoryDropdown.value,
        date: dateInput.value
    };

}


function clearForm() {
    descriptionInput.value = '',

        amountInput.value = '',

        transactionDropdown.value = 'default',

        categoryDropdown.value = 'default',

        dateInput.value = ''
}


function handleAddTransaction() {
    const transactionData = getTransactionData();

    const errors = validateForm(transactionData);

    showErrors(errors);

    if (hasErrors(errors)) return;

    addTransaction(transactionData);

    updateDashboard();

    clearForm();
}

function validateForm(data) {
    const errors = {
        description: '',
        amount: '',
        transactionType: '',
        categoryType: '',
        date: '',
    }

    if (data.description.trim() === '') {
        errors.description = 'Description is required'
    }
    if (isNaN(data.amount)) {
        errors.amount = 'Amount must be a number'
    }
    if (data.amount <= 0) {
        errors.amount = 'Amount must be greater than 0'
    }

    if (data.transactionType === 'default') {
        errors.transactionType = 'Select a transaction Type'
    }
    if (data.categoryType === 'default') {
        errors.categoryType = 'Select a category'
    }
    if (data.date === '') {
        errors.date = 'Enter a valid date'
    }

    return errors;


}


//VALIDATION FUNCTIONS
function showErrors(errors) {
    descriptionErrorMsg.innerText = errors.description;
    amountErrorMsg.innerText = errors.amount;
    transactionTypeErrorMsg.innerText = errors.transactionType;
    categoryErrorMsg.innerText = errors.categoryType;
    dateErrorMsg.innerText = errors.date;

    removeMsgs();
}

function removeMsgs() {
    setTimeout(() => {
        descriptionErrorMsg.innerText = '';
        amountErrorMsg.innerText = '';
        transactionTypeErrorMsg.innerText = '';
        categoryErrorMsg.innerText = '';
        dateErrorMsg.innerText = '';
    }, 5000);
}







//RENDER FUNCTIONS
function updateDashboard() {
    const transactions = getTransactions();
    const processedTransactions = getProcessedTransactions({
        transactions,
        transactionFilter,
        categoryFilter,
        sort: currentSort
    });

    renderPageTransactions(processedTransactions);
    totalIncomeDisplay.innerHTML = `$${getTotalIncome(transactions)}`;
    totalExpenseDisplay.innerHTML = `$${getTotalExpense(transactions)}`;
    newBalanceDisplay.innerHTML = `<span class="dollar-tag">$</span>${getNewBalance(transactions)}`;
    transactionCountDisplay.innerHTML = `${getTransactionCount(transactions)}`;
}

function renderPageTransactions(data) {
    if (data.length === 0) {
        transactionDisplay.innerHTML = `<div class="empty-state">No transactions found.</div>`;
        pageNumberDisplay.innerHTML = '';
        return;
    }

    const paginated = transactionPagination(data, getCurrentPage());
    transactionDisplay.innerHTML = renderTransactions(paginated);
    pageNumberDisplay.innerHTML = generatePageNumbers(data);
}

function renderTransactions(data) {
    let transactionsHTML = '';

    data.forEach(t => {
        const className = t.transactionType === 'income' ? 'income' : 'expense'
        const sign = t.transactionType === 'income' ? '+' : '-'


        transactionsHTML += `<div class="transaction-card">
          <div class="transaction-left">
            <h3>${t.description}</h3>
            <div class="date-section">
                <p>${formatDate(t.date)}</p>
                <span class="divide-tag"></span>
                <p>${t.categoryType}</p>
            </div>
          </div>
          <div class="js-transaction-id transaction-right" data-transaction-id="${t.id}">
            
            <h3 class="${className}">${sign}$${t.amount}</h3>
            <i class="js-delete-btn ph ph-trash delete-btn" ></i>
          </div>
        </div>`
    });

    return transactionsHTML;
}




