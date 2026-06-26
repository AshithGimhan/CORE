import { formatDate } from './utils.js';
import { getTransactions, getProcessedTransactions, transactionPagination } from './transactions.js';
import { handlePage, getCurrentPage, generatePageNumbers } from './pagination.js';
import '../scripts/hamburger.js'

const transactionDisplay = document.querySelector('.js-transactions-list-view');
const pageNumberDisplay = document.querySelector('.js-page-numbers');
const currentPageNoDisplay = document.querySelector('.js-page-number-display')



pageNumberDisplay.addEventListener('click', (event) => {
    handlePage(event);
    updateTransactionPage();
});

if (transactionDisplay) {
    transactionDisplay.addEventListener('click', (event) => {
        pendingDeleteId = handleDelete(event)
    })
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



    const displayedTransaction = transactionPagination(allTransactions, getCurrentPage())


    pageCurrentPageDisplay = `<p>Showing ${firstNumber} to ${lastNumber} of ${allTransactions.length}</p>`

    return pageCurrentPageDisplay;
}



function updateTransactionPage() {
    displayPageNumbers();
    currentPageNoDisplay.innerHTML = currentPageNumber();

}

