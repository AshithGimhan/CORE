import { getTransactions } from "./transactions.js";

const transactions = getTransactions();

let categoriesList = JSON.parse(localStorage.getItem('categories')) || []


//FUNCTIONS
export function getCategories() {
    return categoriesList
}

export function getTransactionCountByCategory(category) {
    let count = 0

    transactions.forEach(t => {
        if (t.categoryType === category) {
            count++
        }
    });

    return count
}

export function getTotalAmountByCategory(category) {
    let amount = 0;

    transactions.forEach(t => {
        if (t.categoryType === category) {
            amount += t.amount
        }
    });

    return amount
}

export function createCategory(name, type, color) {
    const nextId = categoriesList.length === 0 ? 1 : categoriesList[categoriesList.length - 1].id + 1

    let categoryName = name.value;

    return {
        id: nextId,
        category: name.toLowerCase(),
        type,
        transactions: getTransactionCountByCategory(categoryName),
        amount: getTotalAmountByCategory(categoryName),
        color
    }
}

export function addCategory(category) {
    categoriesList.push(category);

    localStorage.setItem("categories", JSON.stringify(categoriesList))
}
