import { getTransactionCount } from "../../../scripts/transactions.js";

describe('getTransactionCount testing', function () {
    it('returns the correct transaction count', function () {
        const transactions = [
            { id: 1, transactionType: 'income', amount: 1000 },
            { id: 2, transactionType: 'expense', amount: 200 },
            { id: 3, transactionType: 'income', amount: 500 },
            { id: 4, transactionType: 'expense', amount: 100 },
            { id: 5, transactionType: 'expense', amount: 900 },
            { id: 6, transactionType: 'income', amount: 100 },
            { id: 7, transactionType: 'income', amount: 50 },
        ];

        const result = getTransactionCount(transactions);

        expect(result).toBe(7);
    })

    it('returns 0 if the array is empty', function () {
        const transactions = [];

        const result = getTransactionCount(transactions);

        expect(result).toBe(0);
    })
})