import { formatDate } from './utils.js';
import { getTransactions, getProcessedTransactions, transactionPagination } from './transactions.js';
import { handlePage, getCurrentPage, generatePageNumbers } from './pagination.js';

const transactionDisplay = document.querySelector('.js-transactions-list-view');
const pageNumberDisplay = document.querySelector('.js-page-numbers');

pageNumberDisplay.addEventListener('click', (event) => {
    handlePage(event);
    updateTransactionPage();
});

updateTransactionPage();

function renderTransactions(data) {
    let transactionHTML = '';

    if (data) {
        data.forEach((t) => {
            transactionHTML += `
            <tr>
              <td>${t.description}</td>
              <td>${t.categoryType}</td>
              <td>${formatDate(t.date)}</td>
              <td>${t.amount}</td>
              <td><i class="js-delete-btn ph ph-trash delete-btn"></i></td>
            </tr>
          `;
        });
    }

    return transactionHTML;
}

function displayPageNumbers() {
    const transactions = getTransactions();
    const processedTransactions = getProcessedTransactions({ transactions });
    const paginatedTransactions = transactionPagination(processedTransactions, getCurrentPage());

    transactionDisplay.innerHTML = renderTransactions(paginatedTransactions);
    pageNumberDisplay.innerHTML = generatePageNumbers(processedTransactions);
}

function updateTransactionPage() {
    displayPageNumbers();
}
