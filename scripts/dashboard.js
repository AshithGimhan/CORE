//DOM
/* HAMBURGER VARIABLES */
const hamburgerBtn = document.querySelector('.js-hamburger-btn');
const hamburgerDisplay = document.querySelector('.js-hamburger-display');
const hamburgerCloseBtn = document.querySelector('.js-ham-close-btn');

/* FORM VARIABLES */
const addTransactionBtn = document.querySelector('.js-add-transaction');
const descriptionInput = document.querySelector('.js-description-input');
const amountInput = document.querySelector('.js-amount-input');
const transactionDropdown = document.querySelector('.js-transaction-dropdown');
const categoryDropdown = document.querySelector('.js-category-dropdown');
const dateInput = document.querySelector('.js-date-input');

/* DISPLAY VARIABLES */
const totalIncomeDisplay = document.querySelector('.js-income-value');
const totalExpenseDisplay = document.querySelector('.js-expense-value')
const newBalanceDisplay = document.querySelector('.js-balance-value')
const transactionCountDisplay = document.querySelector('.js-transaction-count');

//TRANSACTION LIST VARIABLE
const transactionListDisplay = document.querySelector('.js-transaction-list');



//EVENTS
hamburgerBtn.addEventListener('click', () => {
    hamburgerDisplay.classList.add('hamburger-menu-visible');
})

hamburgerCloseBtn.addEventListener('click', () => {
    hamburgerDisplay.classList.remove('hamburger-menu-visible');
})

addTransactionBtn.addEventListener('click', () => {
    addTransaction();
})

//STATE
const transaction = JSON.parse(localStorage.getItem('transaction')) || [];

//INITIALIZE RENDER
updateDashboard();




//FUNCTIONS
function getTransactionData() {

    const formattedDate = new Date(dateInput.value).toLocaleDateString('en-us', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    return {
        id: Date.now() + Math.random(),
        description: descriptionInput.value,
        amount: Number(amountInput.value),
        transactionType: transactionDropdown.value,
        categoryType: categoryDropdown.value,
        date: dateInput.value
    };


}


function addTransaction() {
    const transactionData = getTransactionData();

    transaction.push(transactionData)

    localStorage.setItem("transaction", JSON.stringify(transaction));

    updateDashboard();

}

function formatDate(date) {
    const formattedDate = new Date(date).toLocaleDateString('en-us', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    return formattedDate;
}


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

//UI RENDER
function updateDashboard() {
    transactionListDisplay.innerHTML = renderTransactions();
    totalIncomeDisplay.innerHTML = `$${getTotalIncome()}`
    totalExpenseDisplay.innerHTML = `$${getTotalExpense()}`
    newBalanceDisplay.innerHTML = `$${getNewBalance()}`
    transactionCountDisplay.innerHTML = `${getTransactionCount()}`
}


//RENDER TRANSACTION LIST
function renderTransactions() {
    let transactionsHTML = '';

    transaction.forEach(transactions => {

        const className = transactions.transactionType === 'income' ? 'income' : 'expense'
        const sign = transactions.transactionType === 'income' ? '+' : '-'

        transactionsHTML += `<div class="transaction-card">
          <div class="transaction-left">
            <h3>${transactions.description}</h3>
            <p>${formatDate(transactions.date)}</p>
          </div>
          <div class="js-transaction-id transaction-right" data-transaction-id="${transactions.id}">
            <span class="category-tag">${transactions.categoryType}</span>
            <h3 class="${className}">${sign}$${transactions.amount}</h3>
            <i class="js-delete-btn ph ph-trash delete-btn" ></i>
          </div>
        </div>`
    });


    return transactionsHTML;
}


const transactionDisplay = document.querySelector('.js-transaction-list');

transactionDisplay.addEventListener('click', (event) => {
    handleDelete(event)
})



function handleDelete(event) {
    if (!event.target.classList.contains('js-delete-btn')) {
        return
    }

    const card = event.target.closest('.js-transaction-id');

    if (!card) return

    const transactionId = card.dataset.transactionId

    deleteTransaction(transactionId)
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