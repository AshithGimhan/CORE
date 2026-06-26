import { deleteTransactionById } from "./transactions.js";

//POP UP DOM
const popUpDisplay = document.querySelector('.js-pop-up')

let pendingDeleteId = null;


//DELETE FUNCTIONS
export function handleDelete(event) {
    if (!event.target.classList.contains('js-delete-btn')) {
        return
    }

    const card = event.target.closest('.js-transaction-id');

    const transactionId = card.dataset.transactionId

    popUpDisplay.classList.add('active')

    return transactionId

}

export function confirmDelete(pendingDeleteId) {
    if (!pendingDeleteId) return;

    deleteTransaction(pendingDeleteId);
    pendingDeleteId = null;
    popUpDisplay.classList.remove('active');
}

export function cancelDelete() {
    pendingDeleteId = null;
    popUpDisplay.classList.remove('active')

}

export function deleteTransaction(transactionId) {
    deleteTransactionById(transactionId);
}
