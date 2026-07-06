[
    {
        id: 1,
        category: 'food',
        type: 'expense',
        transactions: getTransactionCountByCategory('food')
    },
    {
        id: 2,
        category: 'transport',
        type: 'expense',
        transactions: getTransactionCountByCategory('transport')
    },
    {
        id: 3,
        category: 'bills',
        type: 'expense',
        transactions: getTransactionCountByCategory('bills')
    },
    {
        id: 4,
        category: 'salary',
        type: 'income',
        transactions: getTransactionCountByCategory('salary')
    },
]


localStorage.removeItem('categories')

JSON.parse(localStorage.getItem('categories'))