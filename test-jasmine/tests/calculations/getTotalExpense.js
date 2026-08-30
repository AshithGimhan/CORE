import { getTotalExpense } from "../../../scripts/transactions.js";

describe('getTotalExpense testing', function () {
    it('sums only expense transactions correctly', function () {

        const transactions = [
            { id: 1, transactionType: 'income', amount: 1000 },
            { id: 2, transactionType: 'expense', amount: 200 },
            { id: 3, transactionType: 'income', amount: 500 },
            { id: 4, transactionType: 'expense', amount: 100 }
        ];

        const result = getTotalExpense(transactions);

        expect(result).toBe(300);

    });

    it('sums expense transactions even if they in string format', function () {

        const transactions = [
            { id: 1, transactionType: 'income', amount: '1000' },
            { id: 2, transactionType: 'expense', amount: '200' },
            { id: 3, transactionType: 'income', amount: '500' },
            { id: 4, transactionType: 'expense', amount: '100' }
        ];

        const result = getTotalExpense(transactions);

        expect(result).toBe(300);

    });

    it('returns 0 when there are no expenses', function () {

        const transactions = [
            { id: 1, transactionType: 'income', amount: '1000' },
            { id: 3, transactionType: 'income', amount: '500' },
        ];

        const result = getTotalExpense(transactions);

        expect(result).toBe(0);

    });
})