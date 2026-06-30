import { activeNavLinks } from "./hamburger.js";
import { getTotalIncome, getTotalExpense, getTransactions } from "./transactions.js";

//DOMS
const lineGraph = document.getElementById('income-vs-expense-line-graph')
const transactions = getTransactions();

new Chart(lineGraph, {
    type: 'line',


    data: {
      
        labels: [
            '1 Jun',
            '6 Jun',
            '11 Jun',
            '16 Jun',
            '21 Jun',
            '26 Jun'
        ],

        datasets: [
            {
                label: 'Income',
                data: [transactions.forEach(t => {
                    
                })],
            },
            {
                label: 'Expense',
                data: [getTotalExpense(transactions)]
            }

        ]


    }
})



activeNavLinks()

