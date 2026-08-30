import { getFilteredTransactions } from "../../../scripts/transactions.js";

describe('getFilteredTransactions testing', function() {

    it('filters transactions correctly by type income', function() {

        const transactions = [
            { id: 1, transactionType: 'income', amount: 1000 },
            { id: 2, transactionType: 'expense', amount: 200 },
            { id: 3, transactionType: 'income', amount: 500 },
            { id: 4, transactionType: 'expense', amount: 100 }
        ];

        const result = getFilteredTransactions(transactions, 'income', 'all');

        expect(result.length).toBe(2);
    });

    it('filters transactions correctly by type expense', function() {

        const transactions = [
            { id: 1, transactionType: 'income', amount: 1000 },
            { id: 2, transactionType: 'expense', amount: 200 },
            { id: 3, transactionType: 'income', amount: 500 },
        ];

        const result = getFilteredTransactions(transactions, 'expense', 'all');

        expect(result.length).toBe(1);
    });

    it('filters transactions correctly by category', function() {

        const transactions = [
            { id: 1, categoryType: 'salary', amount: 1000 },
            { id: 2, categoryType: 'food', amount: 200 },
            { id: 3, categoryType: 'food', amount: 500 },
        ];

        const result = getFilteredTransactions(transactions, 'all', 'salary');

        expect(result.length).toBe(1);
    });

    it('filters transactions correctly when filter is set to all', function() {

        const transactions = [
            { id: 1, transactionType: 'income', categoryType: 'salary', amount: 1000 },
            { id: 2, transactionType: 'expense', categoryType: 'food', amount: 200 },
            { id: 3, transactionType: 'expense', categoryType: 'food', amount: 500 },
        ];

        const result = getFilteredTransactions(transactions, 'all', 'all');

        expect(result.length).toBe(3);
    });

});

