import { getSortedTransactions } from "../../../scripts/transactions.js";

describe('getSortedTransactions testing', function () {

    it('sorts transactions from newest to oldest', function () {

        const transactions = [
            { id: 1, transactionType: 'income', amount: 1000, date: '2026-01-10' },
            { id: 2, transactionType: 'expense', amount: 200, date: '2026-03-05' },
            { id: 3, transactionType: 'income', amount: 500, date: '2026-02-15' }
        ];

        const result = getSortedTransactions(transactions, 'newest-first');

        expect(result[0].id).toBe(2); 
        expect(result[1].id).toBe(3); 
        expect(result[2].id).toBe(1);
    });

    it('sorts transactions from highest amount to lowest', function () {

        const transactions = [
            { id: 1, transactionType: 'income', amount: 1000, date: '2026-01-10' },
            { id: 2, transactionType: 'expense', amount: 200, date: '2026-03-05' },
            { id: 3, transactionType: 'income', amount: 500, date: '2026-02-15' }
        ];

        const result = getSortedTransactions(transactions, 'highest-amount');

        expect(result[0].id).toBe(1); 
        expect(result[1].id).toBe(3); 
        expect(result[2].id).toBe(2);

    });

    it('does not change data in the original array', function () {

        const transactions = [
            { id: 1, transactionType: 'income', amount: 1000, date: '2026-01-10' },
            { id: 2, transactionType: 'expense', amount: 200, date: '2026-03-05' },
            { id: 3, transactionType: 'income', amount: 500, date: '2026-02-15' }
        ];

        const result = getSortedTransactions(transactions, 'highest-amount');

        expect(transactions[0].id).toBe(1); 
        expect(transactions[1].id).toBe(2); 
        expect(transactions[2].id).toBe(3);

    });

});

