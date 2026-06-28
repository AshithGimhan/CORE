import { formatDate } from './utils.js';
import { getTransactions, getProcessedTransactions, transactionPagination } from './transactions.js';
import { handlePage, getCurrentPage, generatePageNumbers, resetPage } from './pagination.js';
import '../scripts/hamburger.js'
import { handleDelete, confirmDelete, cancelDelete } from './deleteService.js';


/* DOM ELEMENTS */
const transactionDisplay = document.querySelector('.js-transactions-list-view');
const emptyTransactionMsg = document.querySelector('.js-empty-transactions')
const pageNumberDisplay = document.querySelector('.js-page-numbers');
const currentPageNoDisplay = document.querySelector('.js-page-number-display')
const sortOption = document.querySelector('.js-sort');
const transactionFilterButtons = document.querySelectorAll('.js-filter-btn[data-filter]');
const categorySelect = document.querySelector('#category-type');
const clearFilterBtn = document.querySelector('.js-clear-filter-sort')
const searchInput = document.querySelector('.js-search-input')
const dateInput = document.querySelector('.js-date-input');
const transactionCount = document.querySelector('.js-transaction-count');
const exportBtn = document.querySelector('.js-export-button');

/* STATE */
let currentSort = 'default';
let transactionFilter = 'all';
let categoryFilter = 'all';
let pendingDeleteId = null;
let currentSearch = '';
let currentDate = '';


/* INITIALIZE */
updateTransactionPage();


/* EVENT LISTENERS */
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
    currentSearch = ''
    currentDate = '';
    dateInput.value = ''
    sortOption.value = 'default';
    searchInput.value = '';
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

        button.classList.add('active');
        button.classList.remove('active');
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

searchInput.addEventListener('input', (e) => {
    currentSearch = e.target.value.trim().toLowerCase();

    clearFilterBtn.classList.add('visible');

    console.log(currentSearch)

    resetPage();
    updateTransactionPage();

});

dateInput.addEventListener('input', e => {
    currentDate = formatDate(e.target.value.trim())

    if (currentDate === 'Invalid Date') {
        currentDate = '';
        clearFilterBtn.classList.remove('visible');
        updateTransactionPage();
        return
    }

    clearFilterBtn.classList.add('visible');

    resetPage();
    updateTransactionPage();
})

exportBtn.addEventListener('click', () => {
    const transactions = getTransactions();

    const processedTransactions = getProcessedTransactions({
        transactions,
        transactionFilter,
        categoryFilter,
        sort: currentSort,
        search: currentSearch,
        dateFilter: currentDate
    });

    generatePDF(processedTransactions);

});


/* FUNCTIONS */
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

function currentPageNumber(processedTransactions) {
    let pageCurrentPageDisplay = ''
    const currentPage = getCurrentPage()
    const pageSize = 5;
    let firstNumber = (currentPage - 1) * pageSize + 1;
    let lastNumber = currentPage * pageSize

    const allTransactions = processedTransactions;


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
        sort: currentSort,
        search: currentSearch,
        dateFilter: currentDate
    });

    renderPageTransactions(processedTransactions);

    if (processedTransactions.length === 0) {
        currentPageNoDisplay.innerHTML = '';
        transactionCount.innerHTML = 'No records found'

    } else {
        transactionCount.innerHTML = `${processedTransactions.length} records found`
        currentPageNoDisplay.innerHTML = currentPageNumber(processedTransactions);
    }

}

function generatePDF(transactions) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const x = {
        desc: 15,
        category: 65,
        date: 90,
        amount: 135,
        transaction: 165
    }

    let y = 25
    const rowHeight = 10;

    doc.setFont("courier");
    doc.setFontSize(14);
    doc.text(10, 10, 'CORE TRANSACTION REPORT');

    doc.setFontSize(10);
    doc.text(x.desc, y, 'DESCRIPTION')
    doc.text(x.category, y, 'CATEGORY')
    doc.text(x.date, y, 'DATE')
    doc.text(x.amount, y, 'AMOUNT')
    doc.text(x.transaction, y, 'TRANSACTION')

    y += rowHeight;

    doc.line(10, y - 7, 200, y - 7)

    transactions.forEach(t => {
        const amount = Number(t.amount).toFixed(2);
        const sign = t.transactionType === 'income' ? '+' : '-'

        if (t.transactionType === 'income') {
            doc.setFillColor(220, 255, 230);
            doc.rect(10, y - 6, 190, 9, 'F')
        } else if (t.transactionType === 'expense') {
            doc.setFillColor(255, 225, 225);
            doc.rect(10, y - 6, 190, 9, 'F')
        }


        doc.text(t.description, x.desc, y);

        doc.text(t.categoryType, x.category, y);
        doc.text(formatDate(t.date), x.date, y);

        doc.text(`${sign}$${amount}`, x.amount, y, { align: 'left' });
        doc.text(t.transactionType, x.transaction, y);


        y += 15

        if (y > 280) {
            doc.addPage();
            y = 20;
        }
    });

    doc.save('CORE_TRANSACTIONS.pdf')

}