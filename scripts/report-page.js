import { activeNavLinks } from "./hamburger.js";
import { getTotalIncome, getTotalExpense, getTransactions } from "./transactions.js";
import { formatDate } from "./utils.js";


//INITIALIZE
activeNavLinks()


//DOMS
const lineGraphElement = document.getElementById('income-vs-expense-line-graph')
const timelineDropdown = document.querySelector('.js-overview-timeline');
const pieChartElement = document.getElementById('category-pie-chart');

//EVENT LISTENERS
timelineDropdown.addEventListener('change', e => {
    timeMode = e.target.value;
    updateChart(timeMode);
});


//DATA FOR CHART
const transactions = getTransactions();
const today = new Date();
let timeMode = 30;


//LINE GRAPH
const lineGraph = new Chart(lineGraphElement, {

    type: 'line',


    data: {

        labels: [],

        datasets: [
            {
                label: 'Income',
                data: [],
                borderColor: '#22c55e',
                backgroundColor: '#22c55e',
                tension: 0.35,
                fill: false,
                borderWidth: 1.5,
                pointRadius: 0
            },

            {
                label: 'Expense',
                data: [],
                borderColor: '#dc2626',
                backgroundColor: '#dc2626',
                tension: 0.35,
                fill: false,
                borderWidth: 1.5,
                pointRadius: 0


            }
        ]
    },

    options: {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
            legend: {
                display: false

            },

            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: '#111827',
                titleColor: '#fff',
                bodyColor: '#d1d5db',
                borderColor: '#374151',
                borderWidth: 1
            },
        },


        interaction: {
            mode: 'index',
            intersect: false
        },

        scales: {
            x: {
                grid: {
                    display: false
                },

                ticks: {
                    color: '#9ca3af',
                    autoSkip: true,
                    maxTicksLimit: 12
                }
            },

            y: {
                grid: {
                    color: 'rgba(156, 163, 175, 0.08)'
                },
                ticks: {
                    color: '#9ca3af'
                }
            }
        }
    }
});


const pieChart = new Chart(pieChartElement, {
    type: 'pie',

    data: {
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: [
                '#22c55e',
                '#3b82f6',
                '#f59e0b',
                '#ef4444',
                '#8b5cf6',
                '#06b6d4',
                '#84cc16',
                '#f97316'
            ]
        }]
    },

    options: {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#9ca3af',
                    boxWidth: 12,
                    font: {
                        size: 13
                    }
                }
            },

            tooltip: {
                backgroundColor: '#111827',
                titleColor: '#ffffff',
                bodyColor: '#d1d5db'
            }
        }
    }
});

updateChart(timeMode)
//FUNCTIONS
function getTransactionsForNumberDays(days) {
    const cutOffDay = new Date();
    cutOffDay.setDate(today.getDate() - days)

    return transactions.filter(t => {
        return new Date(t.date) >= cutOffDay
    });

}

function getDailyTransactions(transactions) {
    const map = new Map();

    transactions.forEach(transaction => {
        const date = new Date(transaction.date).toISOString().split('T')[0];

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

function getMonthlyTransactions(transactions) {
    const map = new Map();

    transactions.forEach(transaction => {
        const date = new Date(transaction.date);

        const monthKey = `${date.getFullYear()}-${date.getMonth()}`

        if (!map.has(monthKey)) {
            map.set(monthKey, {
                date: new Date(date.getFullYear(), date.getMonth(), 1),
                income: 0,
                expense: 0
            });
        }

        const month = map.get(monthKey)

        if (transaction.transactionType === 'income') {
            month.income += transaction.amount
        } else if (transaction.transactionType === 'expense') {
            month.expense += transaction.amount
        }

    });

    return Array.from(map.values()).sort((a, b) => a.date - b.date)
}

function updateChart(mode) {
    let filteredTransactions;
    const isAll = mode === 'all'
    const days = Number(mode)

    if (mode === 'all') {
        filteredTransactions = transactions
    } else {
        filteredTransactions = getTransactionsForNumberDays(days)
    }

    let chartData;


    if (!isAll && days < 180) {
        chartData = getDailyTransactions(filteredTransactions)
        lineGraph.data.labels = chartData.map(item => new Date(item.date).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
        }))
    } else {
        chartData = getMonthlyTransactions(filteredTransactions)
        lineGraph.data.labels = chartData.map(item => new Date(item.date).toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric'
        }))
    }


    lineGraph.data.datasets[0].data = chartData.map(item => item.income)
    lineGraph.data.datasets[1].data = chartData.map(item => item.expense)

    lineGraph.update()

    updatePieChart(filteredTransactions)
}

function updatePieChart(transactions) {
    const totalSpending = getSpendingByCategories(transactions)

    pieChart.data.labels = totalSpending.map(item => item.category)
    pieChart.data.datasets[0].data = totalSpending.map(item => item.expense)


    pieChart.update()
}

function getSpendingByCategories(transactions) {
    const map = new Map();

    transactions.forEach(transaction => {
        if (transaction.transactionType !== 'expense') {
            return
        }

        const category = transaction.categoryType

        if (!map.has(category)) {
            map.set(category, { category, expense: 0 })
        }

        const item = map.get(category);
        item.expense += transaction.amount
    });

    return Array.from(map.values())
}

console.log(getSpendingByCategories(transactions))