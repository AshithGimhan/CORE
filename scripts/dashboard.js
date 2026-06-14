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
    totalIncomeDisplay.innerHTML = `$${getTotalIncome()}`
    totalExpenseDisplay.innerHTML = `$${getTotalExpense()}`
    newBalanceDisplay.innerHTML = `$${getNewBalance()}`
    transactionCountDisplay.innerHTML = `${getTransactionCount()}`
}

