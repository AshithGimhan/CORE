const STORAGE_KEY = 'transaction';

export function getTransactions() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

export function saveTransactions(transactions) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

export function addTransaction(transaction) {
    const transactions = getTransactions();
    transactions.push(transaction);
    saveTransactions(transactions);
    return transactions;
}

export function deleteTransactionById(transactionId) {
    const transactions = getTransactions();
    const index = transactions.findIndex((t) => t.id === transactionId);

    if (index === -1) {
        return transactions;
    }

    transactions.splice(index, 1);
    saveTransactions(transactions);
    return transactions;
}

export function getFilteredTransactions(data, transactionFilter = 'all', categoryFilter = 'default') {
    let filtered = data

    if (transactionFilter !== 'all') {
        filtered = filtered.filter(item => item.transactionType === transactionFilter)
    }

    if (categoryFilter !== 'all') {
        filtered = filtered.filter(item => item.categoryType === categoryFilter)
    }

    return filtered;
}

export function getSortedTransactions(data, sort = 'default') {
    const copy = [...data];

    if (sort === 'newest-first') {
        return copy.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    if (sort === 'oldest-first') {
        return copy.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    if (sort === 'highest-amount') {
        return copy.sort((a, b) => {
            const sa = a.transactionType === 'expense' ? -Number(a.amount) : Number(a.amount);
            const sb = b.transactionType === 'expense' ? -Number(b.amount) : Number(b.amount);
            return sb - sa;
        });
    }

    if (sort === 'lowest-amount') {
        return copy.sort((a, b) => {
            const sa = a.transactionType === 'expense' ? -Number(a.amount) : Number(a.amount);
            const sb = b.transactionType === 'expense' ? -Number(b.amount) : Number(b.amount);
            return sa - sb;
        });
    }

    return copy;
}

export function getProcessedTransactions({ transactions = [], transactionFilter = 'all', categoryFilter = 'default', sort = 'default' } = {}) {
    let data = [...transactions];
    data = getFilteredTransactions(data, transactionFilter, categoryFilter);
    data = getSortedTransactions(data, sort);
    return data;


}

export function transactionPagination(data, currentPage, transactionPerPage = 5) {
    const start = (currentPage - 1) * transactionPerPage;
    const end = start + transactionPerPage;
    return data.slice(start, end);
}

export function getTotalIncome(transactions) {
    return transactions.reduce((total, transaction) => {
        return transaction.transactionType === 'income' ? total + Number(transaction.amount) : total;
    }, 0);
}

export function getTotalExpense(transactions) {
    return transactions.reduce((total, transaction) => {
        return transaction.transactionType === 'expense' ? total + Number(transaction.amount) : total;
    }, 0);
}

export function getNewBalance(transactions) {
    return getTotalIncome(transactions) - getTotalExpense(transactions);
}

export function getTransactionCount(transactions) {
    return transactions.length;
}

