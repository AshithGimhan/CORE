import { getSearchedTransaction } from "../../../scripts/transactions.js";

describe('getSearchedTransaction testing', function () {

    it('sorts transaction from searched keywords', function () {

          const transactions = [
            { id: 1, description: 'salary from abc company', transactionType: 'income', categoryType: 'salary', amount: 1000 },
            { id: 2, description: 'bought food from KFC', transactionType: 'expense', categoryType: 'food', amount: 200 },
            { id: 3, description: 'bought food from mcDonalds', categoryType: 'food', amount: 500 },
        ];

        const result = getSearchedTransaction(transactions, 'bought FOOD');

        expect(result.length).toBe(2); 
    });

    it('returns all transactions when search is empty', function () {

          const transactions = [
            { id: 1, description: 'salary from abc company', transactionType: 'income', categoryType: 'salary', amount: 1000 },
            { id: 2, description: 'bought food from KFC', transactionType: 'expense', categoryType: 'food', amount: 200 },
            { id: 3, description: 'bought food from mcDonalds', categoryType: 'food', amount: 500 },
        ];

        const result = getSearchedTransaction(transactions, '');

        expect(result.length).toBe(3); 
    });



});

