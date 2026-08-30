import { getNewBalance } from "../../../scripts/transactions.js";

describe('getNewBalance testing', function () {
    it('correctly calculates income minus expense', function () {
        const transactions = [
            { id: 1, transactionType: 'income', amount: 1000 },
            { id: 2, transactionType: 'expense', amount: 200 },
            { id: 3, transactionType: 'income', amount: 500 },
            { id: 4, transactionType: 'expense', amount: 100 }
        ];

        const result = getNewBalance(transactions);

        expect(result).toBe(1200);

    });

    it('returns a negative valye when expense exceed income', function () {
        const transactions = [
            { id: 1, transactionType: 'income', amount: 1000 },
            { id: 2, transactionType: 'expense', amount: 2000 },
            { id: 3, transactionType: 'income', amount: 500 },
            { id: 4, transactionType: 'expense', amount: 100 }
        ];

        const result = getNewBalance(transactions);

        expect(result).toBe(-600);

    });
})