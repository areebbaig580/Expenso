const back = document.querySelector('.symbol');
const income = document.getElementById('income');
const expense = document.getElementById('expense');
const ctx = document.getElementById('myChart');

updateUi();
history();


back.addEventListener('click', (evt) => {
    window.location.href = "../index.html";
})

function updateUi() {
    let inc = localStorage.getItem("income");
    let exp = localStorage.getItem("expense");

    income.innerHTML = `<i class="fa-solid fa-indian-rupee-sign icon3"></i> ${inc}`
    expense.innerHTML = `<i class="fa-solid fa-indian-rupee-sign icon3"></i> ${exp}`

}

function history() {
    let alltransaction = JSON.parse(localStorage.getItem('transaction')) || [];
    const historyCards = document.querySelector(".history-cards");

    historyCards.innerHTML = '';
    const notcard = `
    <div class="noTC">
        <div class="noT">No transaction yet</div>
    </div>`
    if (alltransaction.length === 0) {
        historyCards.innerHTML = notcard;
        return;
    }

    let allcard = '';
    for (let transaction of alltransaction.reverse()) {
        const card =
            `<div class="card">
                    <div class="left">
                        <div class="description">${transaction.description}</div>
                        <div class="date">${transaction.date}</div>
                    </div>
                    <div class="right ${transaction.type}"><i class="fa-solid fa-indian-rupee-sign ${transaction.type}-sign"></i> ${transaction.amount}</div>
                </div>`;

        allcard += card;
    }
    historyCards.innerHTML = allcard;
}

function dailyTransactions() {
    let alltransaction = JSON.parse(localStorage.getItem('transaction'))||[];
    
    let today = new Date();
    let dayOfWeek = today.getDay();
    let daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    let monday = new Date(today);
    monday.setDate(today.getDate() - daysFromMonday);


    let dailyExpense = [0, 0, 0, 0, 0, 0, 0];
    let dailyIncome = [0, 0, 0, 0, 0, 0, 0];

    for (let i = 0; i < 7; i++) {

        let currentDay = new Date(monday);
        currentDay.setDate(monday.getDate() + i);
        let dateString = currentDay.toISOString().split('T')[0];

        let dayTransactions = alltransaction.filter(s => s.date === dateString);

        let totalIncome = 0;
        for (let transaction of dayTransactions) {
            if(transaction.type === "income"){
                dailyIncome[i] += transaction.amount;
            }else if(transaction.type === "expense"){
                dailyExpense[i] += transaction.amount;
            }

        }

    }

    return {dailyIncome, dailyExpense}
}
let transaction = dailyTransactions();
console.log(transaction.dailyExpense);

new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', `Sat`, `Sun`],
        datasets: [
            {
                label: 'Income',
                data: transaction.dailyIncome,
                backgroundColor: '#1ee0a9'
            },
            {
                label: 'Expense',
                data: transaction.dailyExpense,
                backgroundColor: '#31e0bd'
            }]
    },
    options: {
        scales: {
            y: {
                grid: {
                    color: "#808080"
                }
            },
            x: {
                grid: {
                    color: "#808080"
                }

            }
        }
    }
});