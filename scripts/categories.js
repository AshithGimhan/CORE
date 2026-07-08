import { getTransactions } from "./transactions.js";

const transactions = getTransactions();
updateCategories(getCategories())

//FUNCTIONS
export function getCategories() {
    return JSON.parse(localStorage.getItem('categories')) || []
}

export function saveCategories(categories) {
    localStorage.setItem("categories", JSON.stringify(categories))
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
    const categories = getCategories()

    const nextId = categories.length === 0 ? 1 : categories[categories.length - 1].id + 1

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
    const categories = getCategories()
    categories.push(category);

    localStorage.setItem("categories", JSON.stringify(categories))
}


export function deleteCategoryById(categoryId) {
    const categories = getCategories();
    const index = categories.findIndex(c => c.id === categoryId);

    console.log(categories)
    if (index === -1) {
        return categories
    }

    categories.splice(index, 1)
    saveCategories(categories)
    return categories
}

export function updateCategories(categories) {
    categories.forEach(category => {
        category.transactions = getTransactionCountByCategory(category.category);
        category.amount = getTotalAmountByCategory(category.category);
    });

    localStorage.setItem('categories', JSON.stringify(categories));
}
