import { deleteCategoryById } from "./categories.js";
import { deleteTransactionById } from "./transactions.js";

//POP UP DOM
const TransactionDeletePopUp = document.querySelector('.js-pop-up-transaction');
const categoryDeletePopUp = document.querySelector('.js-pop-up-category')

let pendingDeleteId = null;


//DELETE FUNCTIONS
export function handleDelete(event) {
    if (!event.target.classList.contains('js-delete-btn')) {
        return
    }

    const card = event.target.closest('.js-transaction-id');

    const transactionId = card.dataset.transactionId

    TransactionDeletePopUp.classList.add('active')

    return transactionId

}

export function confirmDelete(pendingDeleteId) {
    if (!pendingDeleteId) return;

    deleteTransaction(pendingDeleteId);
    pendingDeleteId = null;
    TransactionDeletePopUp.classList.remove('active');
}

export function cancelDelete() {
    pendingDeleteId = null;
    TransactionDeletePopUp.classList.remove('active')

}

export function deleteTransaction(transactionId) {
    deleteTransactionById(transactionId);
}



export function handleDeleteForCategory(event) {
    if (!event.target.classList.contains('js-delete-btn')) {
        return
    }

    const categoryCard = event.target.closest('.js-category-id')

    const categoryId = categoryCard.dataset.categoryId

    categoryDeletePopUp.classList.add('active');

    return categoryId
}

export function cancelDeleteForCategory() {
    categoryDeletePopUp.classList.remove('active');
}

export function confirmDeleteForCategory(pendingCategoryDeleteid) {
    if (!pendingCategoryDeleteid) {
        return
    }

    deleteCategory(pendingCategoryDeleteid);
    pendingCategoryDeleteid = null;
    categoryDeletePopUp.classList.remove('active');
}

export function deleteCategory(categoryId) {
    deleteCategoryById(categoryId)
}