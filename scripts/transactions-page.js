import { formatDate } from './utils.js';
import { getTransactions, getProcessedTransactions, transactionPagination } from './transactions.js';
import { handlePage, getCurrentPage, generatePageNumbers, resetPage } from './pagination.js';
import '../scripts/hamburger.js'
import { handleDelete, confirmDelete, cancelDelete } from './deleteService.js';

const transactionDisplay = document.querySelector('.js-transactions-list-view');
const emptyTransactionMsg = document.querySelector('.js-empty-transactions')
const pageNumberDisplay = document.querySelector('.js-page-numbers');
const currentPageNoDisplay = document.querySelector('.js-page-number-display')


//FILTER DOM
const sortOption = document.querySelector('.js-sort');
const transactionFilterButtons = document.querySelectorAll('.js-filter-btn[data-filter]');
const categorySelect = document.querySelector('#category-type');
const clearFilterBtn = document.querySelector('.js-clear-filter-sort')


let currentSort = 'default';
let transactionFilter = 'all';
let categoryFilter = 'all';
let pendingDeleteId = null;

pageNumberDisplay.addEventListener('click', (event) => {
    handlePage(event);
    updateTransactionPage();
});

if (transactionDisplay) {
    transactionDisplay.addEventListener('click', (event) => {
        pendingDeleteId = handleDelete(event)
    })
}

document.querySelector('.js-btn-confirm').addEventListener('click', () => {
    confirmDelete(pendingDeleteId);
    updateTransactionPage();

})
document.querySelector('.js-btn-cancel').addEventListener('click', () => {
    cancelDelete();
})


sortOption.addEventListener('change', (option) => {
    currentSort = option.target.value;
    resetPage();
    clearFilterBtn.classList.add('visible');
    updateTransactionPage();
})


clearFilterBtn.addEventListener('click', () => {
    currentSort = 'default';
    transactionFilter = 'all';
    categoryFilter = 'all';
    sortOption.value = 'default';
    if (categorySelect) categorySelect.value = 'all';
    clearFilterBtn.classList.remove('visible');
    resetPage();
    updateTransactionPage();
});

transactionFilterButtons.forEach((button) => {
    button.addEventListener('click', () => {
        transactionFilter = button.dataset.filter || 'all';

        if (transactionFilter === 'all' && categoryFilter === 'all') {
            clearFilterBtn.classList.remove('visible');
        } else {
            clearFilterBtn.classList.add('visible');
        }

        resetPage();
        updateTransactionPage();
    })
});

if (categorySelect) {
    categorySelect.addEventListener('change', (event) => {
        categoryFilter = event.target.value || 'all';

        if (transactionFilter === 'all' && categoryFilter === 'all') {
            clearFilterBtn.classList.remove('visible');
        } else {
            clearFilterBtn.classList.add('visible');
        }

        resetPage();
        updateTransactionPage();
    });
}


updateTransactionPage();

function renderTransactions(data) {
    let transactionHTML = '';

    if (data) {

        data.forEach((t) => {

            let className = t.transactionType === 'income' ? 'income' : 'expense'

            transactionHTML += `
            <tr>
              <td class="desc-color">${t.description}</td>
              <td >${t.categoryType}</td>
              <td>${formatDate(t.date)}</td>
              <td class="${className}">$${t.amount}</td>
              <td class="js-transaction-id" data-transaction-id="${t.id}"><i class="js-delete-btn ph ph-trash delete-btn"></i></td>
            </tr>
          `;
        });
    }

    return transactionHTML;
}

function renderPageTransactions(data) {
    if (data.length === 0) {
        transactionDisplay.innerHTML = ''
        emptyTransactionMsg.innerHTML = `<div class="empty-state">No transactions found.</div>`;
        pageNumberDisplay.innerHTML = '';
        return;
    }

    const paginated = transactionPagination(data, getCurrentPage());
    transactionDisplay.innerHTML = renderTransactions(paginated);
    emptyTransactionMsg.innerHTML = ''
    pageNumberDisplay.innerHTML = generatePageNumbers(data);
}

function currentPageNumber() {
    let pageCurrentPageDisplay = ''
    const currentPage = getCurrentPage()
    const pageSize = 5;
    let firstNumber = (currentPage - 1) * pageSize + 1;
    let lastNumber = currentPage * pageSize

    const allTransactions = getTransactions()


    if (lastNumber > allTransactions.length) {
        lastNumber = allTransactions.length
    }

    if (!allTransactions.length) {
        return pageCurrentPageDisplay = 'No transactions found'
    }

    const displayedTransaction = transactionPagination(allTransactions, getCurrentPage())


    pageCurrentPageDisplay = `<p>Showing ${firstNumber} to ${lastNumber} of ${allTransactions.length}</p>`

    return pageCurrentPageDisplay;
}



function updateTransactionPage() {
    const transactions = getTransactions();
    const processedTransactions = getProcessedTransactions({
        transactions,
        transactionFilter,
        categoryFilter,
        sort: currentSort
    });

    renderPageTransactions(
        processedTransactions
    )
    currentPageNoDisplay.innerHTML = currentPageNumber();



}


