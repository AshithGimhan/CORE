import { deleteTransactionById, addTransaction, getTransactions } from "../../../scripts/transactions.js";

describe('deleteTransactionById testing', function () {
    beforeEach(function () {
        localStorage.clear();
    })

    it('removes transaction with the matching id', function () {

        addTransaction(
            {
                id: 1,
                transactionType: 'income',
                amount: 1000,
                category: 'salary'
            }
        )

        addTransaction(
            {
                id: 2,
                transactionType: 'expense',
                amount: 500,
                category: 'food'
            }
        )

        const result = deleteTransactionById(1)

        expect(result.length).toBe(1)
        expect(result[0].id).toBe(2)


    })


    it('returns array if the id is not found', function () {

        addTransaction(
            {
                id: 1,
                transactionType: 'income',
                amount: 1000,
                category: 'salary'
            }
        )

        addTransaction(
            {
                id: 2,
                transactionType: 'expense',
                amount: 500,
                category: 'food'
            }
        )

        const result = deleteTransactionById(3)

        expect(result.length).toBe(2)
   


    })

})
