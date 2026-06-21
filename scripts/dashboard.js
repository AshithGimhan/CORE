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


//FILTER DOM
const sortOption = document.querySelector('.js-sort');
const filterOption = document.querySelectorAll('.js-filter-btn');
const arrowElement = document.querySelector('.js-arrow');
const closeElement = document.querySelector('.js-close')
const clearFilterBtn = document.querySelector('.js-clear-filter-sort')


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
    pendingDeleteId = handleDelete(event)

})

document.querySelector('.js-btn-confirm').addEventListener('click', () => {
    confirmDelete();
})
document.querySelector('.js-btn-cancel').addEventListener('click', () => {
    cancelDelete();
})

pageNumberDisplay.addEventListener('click', (event) => {
    handlePage(event);
});

sortOption.addEventListener('change', (option) => {
    currentSort = option.target.value;
    currentPage = 1
    clearFilterBtn.classList.add('visible')
    updateDashboard();
})

clearFilterBtn.addEventListener('click', () => {
    currentSort = 'default'
    currentFilter = 'All'
    sortOption.value = 'default'
    clearFilterBtn.classList.remove('visible')

    updateDashboard();
});

filterOption.forEach((button) => {
    button.addEventListener('click', () => {
        currentFilter = button.innerHTML;
        currentPage = 1;
        clearFilterBtn.classList.add('visible')
        updateDashboard();
    })
});



//STATE
const transaction = JSON.parse(localStorage.getItem('transaction')) || [];
let currentPage = 1;
let currentSort = 'default'
let currentFilter = 'All';
let pendingDeleteId = null;


//INITIALIZE RENDER
updateDashboard();



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

    return transactionId

}

function confirmDelete() {
    if (!pendingDeleteId) return;

    deleteTransaction(pendingDeleteId);
    pendingDeleteId = null;
    popUpDisplay.classList.remove('active');
}

function cancelDelete() {
    pendingDeleteId = null;
    popUpDisplay.classList.remove('active')

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
    const card = event.target.closest('.js-page-number-btn')

    if (!card) return

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


//SORT FUNCTIONS
function getSortedTransactions(data) {
    const copy = [...data]


    if (currentSort === 'newest-first') {
        return copy.sort((a, b) => new Date(b.date) - new Date(a.date))
    }

    if (currentSort === 'oldest-first') {
        return copy.sort((a, b) => new Date(a.date) - new Date(b.date))
    }

    if (currentSort === 'highest-amount') {
        return copy.sort((a, b) => {
            const sa = a.transactionType === 'expense' ? -Number(a.amount) : Number(a.amount);
            const sb = b.transactionType === 'expense' ? -Number(b.amount) : Number(b.amount);
            return sb - sa;
        })
    }

    if (currentSort === 'lowest-amount') {
        return copy.sort((a, b) => {
            const sa = a.transactionType === 'expense' ? -Number(a.amount) : Number(a.amount);
            const sb = b.transactionType === 'expense' ? -Number(b.amount) : Number(b.amount);
            return sa - sb;
        })
    }


    return copy


}




//FILTER FUNCTIONS
function getFilteredTransactions(data) {
    const copy = [...data]

    if (currentFilter === 'All') {
        return copy
    }
    if (currentFilter === 'Income') {
        return copy.filter(data => data.transactionType === 'income')
    }
    if (currentFilter === 'Expense') {
        return copy.filter(data => data.transactionType === 'expense')
    }

    return copy;
}


//RENDER FUNCTIONS
function updateDashboard() {

    renderPageTransactions();
    totalIncomeDisplay.innerHTML = `$${getTotalIncome()}`
    totalExpenseDisplay.innerHTML = `$${getTotalExpense()}`
    newBalanceDisplay.innerHTML = `<span class="dollar-tag">$</span>${getNewBalance()}`
    transactionCountDisplay.innerHTML = `${getTransactionCount()}`

}

function getProcessedTransactions() {
    let data = [...transaction]

    data = getFilteredTransactions(data);

    data = getSortedTransactions(data);



    return data
}

function renderPageTransactions() {
    const data = getProcessedTransactions();

    if (data.length === 0) {
        transactionDisplay.innerHTML = `<div class="empty-state">No transactions found.</div>`;
        pageNumberDisplay.innerHTML = '';
        return;
    }

    const paginated = transactionPagination(data);

    transactionDisplay.innerHTML = renderTransactions(paginated)

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


function transactionPagination(data) {
    const transactionPerPage = 5;
    const start = (currentPage - 1) * transactionPerPage
    const end = start + transactionPerPage

    return data.slice(start, end)
}

function generatePageNumbers(data) {
    let pageNumbers = data.length / 5
    pageNumbers = Math.ceil(pageNumbers)

    if (data.length === 0) return;

    let PageNumberHTML = ''

    for (let i = 1; i <= pageNumbers; i++) {
        PageNumberHTML += `<button class="js-page-number-btn page-number-btn ${i === currentPage ? 'active-page-number' : ''} " data-page-id="${i}">${i}</button>`
    }

    return PageNumberHTML
}




