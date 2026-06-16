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


//POP UP DOM
const popUpDisplay = document.querySelector('.js-pop-up')

//EVENT LISTENERS
hamburgerBtn.addEventListener('click', () => {
    hamburgerDisplay.classList.add('hamburger-menu-visible');
})

hamburgerCloseBtn.addEventListener('click', () => {
    hamburgerDisplay.classList.remove('hamburger-menu-visible');
})

addTransactionBtn.addEventListener('click', () => {
    addTransaction();
})

transactionDisplay.addEventListener('click', (event) => {
    handleDelete(event)
})

pageNumberDisplay.addEventListener('click', (event) => {
    handlePage(event);
});



//STATE
const transaction = JSON.parse(localStorage.getItem('transaction')) || [];
let currentPage = 1;


//INITIALIZE RENDER
updateDashboard();



//FORM FUNCTIONS
function getTransactionData() {
    return {
        id: Date.now() + Math.random(),
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


function addTransaction() {
    const transactionData = getTransactionData();

    const errors = validateForm(transactionData);

    showErrors(errors);

    if (hasErrors(errors)) return;

    transaction.push(transactionData)

    localStorage.setItem("transaction", JSON.stringify(transaction));

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



//HELPER FUNCTIONS
function formatDate(date) {
    const formattedDate = new Date(date).toLocaleDateString('en-us', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    return formattedDate;
}

function hasErrors(errors) {
    return Object.values(errors).some(error => {
        return error !== ''
    })
}



//CALCULATION FUNCTIONS
function getTotalIncome() {
    let totalIncome = 0
    transaction.forEach(t => {
        if (t.transactionType === 'income') {
            totalIncome += Number(t.amount)
        }
    });

    return totalIncome;
}

function getTotalExpense() {
    let totalExpense = 0;

    transaction.forEach(t => {
        if (t.transactionType === 'expense') {
            totalExpense += Number(t.amount);
        }
    })

    return totalExpense;
}


function getNewBalance() {
    return getTotalIncome() - getTotalExpense();
}

function getTransactionCount() {
    return transaction.length
}



//DELETE FUNCTIONS
function handleDelete(event) {
    if (!event.target.classList.contains('js-delete-btn')) {
        return
    }

    const card = event.target.closest('.js-transaction-id');

    const transactionId = card.dataset.transactionId

    popUpDisplay.classList.add('active')

    confirmDelete(transactionId);

}

function confirmDelete(transactionId) {
    document.querySelector('.js-btn-confirm').addEventListener('click', () => {
        deleteTransaction(transactionId)
        popUpDisplay.classList.remove('active')
    })
    document.querySelector('.js-btn-cancel').addEventListener('click', () => {
        popUpDisplay.classList.remove('active')
    })
}

function deleteTransaction(transactionId) {
    const index = transaction.findIndex(t => t.id == transactionId)

    if (index === -1) {
        return
    }

    transaction.splice(index, 1);

    localStorage.setItem('transaction', JSON.stringify(transaction))

    updateDashboard();

}


//PAGINATION FUNCTIONS
function handlePage(event) {
    if (!event.target.classList.contains('js-page-number-btn')) {
        return
    }

    const card = event.target.closest('.js-page-number-btn')
    const pageId = Number(card.dataset.pageId)

    updatePage(pageId)

    updateDashboard();

}

function updatePage(pageId) {
    currentPage = pageId;
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
    transactionDisplay.innerHTML = renderTransactions();
    totalIncomeDisplay.innerHTML = `$${getTotalIncome()}`
    totalExpenseDisplay.innerHTML = `$${getTotalExpense()}`
    newBalanceDisplay.innerHTML = `$${getNewBalance()}`
    transactionCountDisplay.innerHTML = `${getTransactionCount()}`
    pageNumberDisplay.innerHTML = generatePageNumbers()
}

function renderTransactions() {
    let transactionsHTML = '';
    const visibleTransaction = transactionPagination();


    visibleTransaction.forEach(t => {
        const className = t.transactionType === 'income' ? 'income' : 'expense'
        const sign = t.transactionType === 'income' ? '+' : '-'


        transactionsHTML += `<div class="transaction-card">
          <div class="transaction-left">
            <h3>${t.description}</h3>
            <p>${formatDate(t.date)}</p>
          </div>
          <div class="js-transaction-id transaction-right" data-transaction-id="${t.id}">
            <span class="category-tag">${t.categoryType}</span>
            <h3 class="${className}">${sign}$${t.amount}</h3>
            <i class="js-delete-btn ph ph-trash delete-btn" ></i>
          </div>
        </div>`
    });

    return transactionsHTML;
}

function transactionPagination() {
    const transactionPerPage = 5;
    const start = (currentPage - 1) * transactionPerPage
    const end = start + transactionPerPage

    return transaction.slice(start, end)
}

function generatePageNumbers() {
    let pageNumbers = transaction.length / 5
    pageNumbers = Math.ceil(pageNumbers)

    let PageNumberHTML = ''

    for (let i = 1; i <= pageNumbers; i++) {
        PageNumberHTML += `<button class="js-page-number-btn page-number-btn ${i === currentPage ? 'active' : ''} " data-page-id="${i}">${i}</button>`
    }

    return PageNumberHTML
}




