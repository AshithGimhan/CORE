import { addTransaction, getTransactions } from "../../../scripts/transactions.js";

describe('addTransaction testing', function () {
    beforeEach(function () {
        localStorage.clear();
    })

    it('adds a transaction and saves it to the storage', function () {

        addTransaction(
            {
                transactionType: 'income',
                amount: 1000,
                category: 'salary'
            }
        )

        const transactions = getTransactions();

        expect(transactions.length).toBe(1);
        expect(transactions[0].amount).toBe(1000);
        expect(transactions[0].transactionType).toBe('income');
    })

})

