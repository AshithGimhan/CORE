import { getTransactions } from "./transactions.js";

const transactions = getTransactions();
updateCategories(getCategories())


const defaultCategories = [
  {
    id: 1,
    category: "food",
    type: "expense",
    transactions: 0,
    amount: 0,
    color: "#E76F51"
  },
  {
    id: 2,
    category: "transport",
    type: "expense",
    transactions: 0,
    amount: 0,
    color: "#457B9D"
  },
  {
    id: 3,
    category: "bills",
    type: "expense",
    transactions: 0,
    amount: 0,
    color: "#6C757D"
  },
  {
    id: 4,
    category: "salary",
    type: "income",
    transactions: 0,
    amount: 0,
    color: "#2A9D8F"
  }
]


//FUNCTIONS
export function getCategories() {
    return JSON.parse(localStorage.getItem('categories')) || []
}

console.log(getCategories())
export function saveCategories(categories) {
    localStorage.setItem("categories", JSON.stringify(categories))
}

export function getTransactionCountByCategory(category) {
    return transactions.filter(t => {
        return t.categoryType === category
    }).length;

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

    let categoryName = name;

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
    updateCategories(categories)

    localStorage.setItem("categories", JSON.stringify(categories))
}


export function deleteCategoryById(categoryId) {
    const categories = getCategories();
    const index = categories.findIndex(c => c.id === Number(categoryId));

    console.log(index)
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

    return categories
}
