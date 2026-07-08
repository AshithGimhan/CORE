import { getCategories } from "./categories.js";
import { activeNavLinks } from "./hamburger.js";
import { getTotalIncome, getTotalExpense, getTransactions } from "./transactions.js";
import { capitalize, formatDate } from "./utils.js";


//INITIALIZE
activeNavLinks()


//DOMS
const lineGraphElement = document.getElementById('income-vs-expense-line-graph')
const lineGraphBodyElement = document.querySelector('.graph-body')
const timelineDropdown = document.querySelector('.js-overview-timeline');
const pieChartElement = document.getElementById('category-pie-chart');
const pieChartBodyElemet = document.querySelector('.pie-chart-body')
const overviewElement = document.querySelector('.js-overview');
const categoryContainer = document.querySelector('.js-category-list')

//EVENT LISTENERS
timelineDropdown.addEventListener('change', e => {
    timeMode = e.target.value;
    updateChart(timeMode);

    if (timeMode === 'all') {
        overviewElement.innerHTML = `All time overview`
    } else {
        overviewElement.innerHTML = `Last ${timeMode} days overview`
    }
});


//DATA FOR CHART
const transactions = getTransactions();
const today = new Date();
let timeMode = 30;
const categories = getCategories()

const colorMap = Object.fromEntries(
    categories.map(item => [item.category, item.color])
)

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

//PIE CHART
const pieChart = new Chart(pieChartElement, {
    type: 'doughnut',

    data: {
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: []
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

    if (filteredTransactions.length === 0) {
        lineGraphBodyElement.innerHTML = '<h3>No transaction history yet</h3> <p>Add income and expense transactions to view your financial trends over time.</p>'
    }

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
    renderCategoryList(getSpendingByCategories(filteredTransactions))
}

function updatePieChart(transactions) {
    const totalSpending = getSpendingByCategories(transactions)

    if (totalSpending.length === 0) {
        pieChartBodyElemet.innerHTML = `<h3>Nothing to compare
</h3> <p>Add transactions to see your spending breakdown.</p>`
    }
    pieChart.data.labels = totalSpending.map(item => capitalize(item.category))

    pieChart.data.datasets[0].data = totalSpending.map(item => item.expense)
    pieChart.data.datasets[0].backgroundColor = totalSpending.map(item => colorMap[item.category])

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



function renderCategoryList(categories) {
    categories.sort((a, b) => {
        return b.expense - a.expense
    })


    if (categories.length === 0) {
        categoryContainer.innerHTML = '<h3>Nothing to compare</h3> <p>Add transactions to see your spending breakdown.</p>'

    }

    const maxExpense = categories[0]?.expense ?? 1;


    if (categories.length >= 1) {
        categoryContainer.innerHTML = categories.map((item, index) => {
            return `<div class="category">
              <div class="category-header">
                <span>${capitalize(item.category)}</span>
                <span>$${item.expense}</span>
              </div>

              <div class="progress">
                <div class="progress-fill" style="
                width:${(item.expense / maxExpense) * 100}%;
                background:${colorMap[item.category]};
                ">
                </div>
              </div>

            </div>`
        }
        ).join('')
    }

}


