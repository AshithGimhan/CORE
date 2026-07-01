import { activeNavLinks } from "./hamburger.js";
import { getTotalIncome, getTotalExpense, getTransactions } from "./transactions.js";
import { formatDate } from "./utils.js";


//INITIALIZE
activeNavLinks()


//DOMS
const lineGraph = document.getElementById('income-vs-expense-line-graph')
const transactions = getTransactions();
const today = new Date();


//DATA FOR CHART
const lastThirtyDayTransactions = getTransactionsForNumberDays(30);
const dailyTransactions = getDailyTransactions()


const labels = dailyTransactions.map(item => new Date(item.date).toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short'
}))
const income = dailyTransactions.map(item => item.income)
const expense = dailyTransactions.map(item => item.expense)


//LINE GRAPH
new Chart(lineGraph, {
    type: 'line',


    data: {

        labels: labels,

        datasets: [
            {
                label: 'Income',
                data: income,
                borderColor: '#22c55e',
                backgroundColor: 'rgba(34, 197, 94, 0.08)',
                tension: 0.3,
                fill: true,
                borderWidth: 2,
                pointRadius: 0
            },

            {
                label: 'Expense',
                data: expense,
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.08)',
                tension: 0.3,
                fill: true,
                borderWidth: 2,
                pointRadius: 0

            }
        ]
    },

    options: {
        reponsive: true,
        maintainAspectRatio: false
    }
})




//FUNCTIONS
function getTransactionsForNumberDays(days) {
    const cutOffDay = new Date();
    cutOffDay.setDate(today.getDate() - days)

    return transactions.filter(t => {
        return new Date(t.date) >= cutOffDay
    });

}

function getDailyTransactions() {
    const map = new Map()

    lastThirtyDayTransactions.forEach(transaction => {
        const date = transaction.date

        if (!map.has(date)) {
            map.set(date, { date, income: 0, expense: 0 });
        }

        const day = map.get(date)

        if (transaction.transactionType === 'income') {
            day.income += transaction.amount
        } else if (transaction.transactionType === 'expense') {
            day.expense += transaction.amount
        }

    });

    return Array.from(map.values()).sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
    })
}





