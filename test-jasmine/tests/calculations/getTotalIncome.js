import { getTotalIncome } from "../../../scripts/transactions.js";

describe('getTotalIncome testing', function() {

    it('sums only income transactions correctly', function() {

        const transactions = [
            { id: 1, transactionType: 'income', amount: 1000 },
            { id: 2, transactionType: 'expense', amount: 200 },
            { id: 3, transactionType: 'income', amount: 500 },
            { id: 4, transactionType: 'expense', amount: 100 }
        ];

        const result = getTotalIncome(transactions);

        expect(result).toBe(1500);
    });

    it('correctly sums income when the amount is a string', function() {

        const transactions = [
            { id: 1, transactionType: 'income', amount: '1000' },
            { id: 2, transactionType: 'expense', amount: '200' },
            { id: 3, transactionType: 'income', amount: '500' },
            { id: 4, transactionType: 'expense', amount: '100' }
        ];

        const result = getTotalIncome(transactions);

        expect(result).toBe(1500);
    });

    it('returns 0 when there is no income', function() {

        const transactions = [
            { id: 2, transactionType: 'expense', amount: '200' },
            { id: 4, transactionType: 'expense', amount: '100' }
        ];

        const result = getTotalIncome(transactions);

        expect(result).toBe(0);
    });


});

