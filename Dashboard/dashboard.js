const back = document.querySelector('.symbol');
const income = document.getElementById('income');
const expense = document.getElementById('expense');
const ctx = document.getElementById('myChart');
const filterSel = document.getElementById('filter-type');
const filter = document.getElementById('filter'); 

updateUi();
history();

back.addEventListener('click', (evt) => {
    window.location.href = "../index.html";
});

filterSel.addEventListener('change', (evt) => {
    history(evt.target.value);
});

filter.addEventListener('change', (evt)=>{
    updateChart(evt.target.value);
})

function updateUi() {
    let inc = localStorage.getItem("income");
    let exp = localStorage.getItem("expense");

    income.innerHTML = `<i class="fa-solid fa-indian-rupee-sign icon3"></i> ${inc}`
    expense.innerHTML = `<i class="fa-solid fa-indian-rupee-sign icon3"></i> ${exp}`

};

function history(filterType = 'All') {
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
    let reverseArr = [...alltransaction].reverse();
    if (filterType !== 'All') {
        reverseArr = reverseArr.filter(s => s.type === filterType);
    }

    let allcard = '';

    for (let transaction of reverseArr) {
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
};

function dailyTransactions() {
    let alltransaction = JSON.parse(localStorage.getItem('transaction')) || [];

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
        for (let transaction of dayTransactions) {
            if (transaction.type === "income") {
                dailyIncome[i] += transaction.amount;
            } else if (transaction.type === "expense") {
                dailyExpense[i] += transaction.amount;
            }
        }
    }
    return { dailyIncome, dailyExpense }
};

function weeklyTransaction(){
    let alltransaction = JSON.parse(localStorage.getItem('transaction')) || [];

    let today = new Date();
    let currMonth = today.getMonth();
    let currYear = today.getFullYear();
    let totDays = new Date(currYear, currMonth+1, 0).getDate();

    let weeklyIncome = [0, 0, 0, 0];
    let weeklyExpense = [0, 0, 0, 0];

    for(let transaction of alltransaction){
        let transactionDate = new Date(transaction.date);

        if(transactionDate.getFullYear() === currYear && transactionDate.getMonth() === currMonth){
            let day = transactionDate.getDate();

            if(day<=7){
                weekIndex = 0
            }else if (day <= 14) {
                weekIndex = 1; 
            } else if (day <= 21) {
                weekIndex = 2; 
            } else {
                weekIndex = 3; 
            }

           if (transaction.type === "income"){
            weeklyIncome[weekIndex] += transaction.amount;
           } else if (transaction.type === "expense"){
            weeklyExpense[weekIndex] += transaction.amount;
           }
        }
    }
    return {weeklyIncome, weeklyExpense}
};

function yearlyTransaction(){
    let alltransaction = JSON.parse(localStorage.getItem('transaction')) || [];

    let today = new Date();
    let currYear = today.getFullYear();

    let monthlyIncome = [0,0,0,0,0,0,0,0,0,0,0,0];
    let monthlyExpense = [0,0,0,0,0,0,0,0,0,0,0,0];

    for(let transaction of alltransaction){
        let transactionDate = new Date(transaction.date);

        if(transactionDate.getFullYear() === currYear){
            let month = transactionDate.getMonth();
            weekIndex = month;

           if (transaction.type === "income"){
            monthlyIncome[weekIndex] += transaction.amount;
           } else if (transaction.type === "expense"){
            monthlyExpense[weekIndex] += transaction.amount;
           }
        }
    }
    return {monthlyIncome , monthlyExpense}
};

let myChart;
myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', `Sat`, `Sun`],
        datasets: [
            {
                label: 'Income',
                data: [],
                backgroundColor: '#1ee0a9'
            },
            {
                label: 'Expense',
                data: [],
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

function updateChart(selected){
    let daysData = dailyTransactions();
    let weekData = weeklyTransaction();
    let monthData = yearlyTransaction();
    let labelData = [];
    let incomeData = [];
    let expenseData = [];

    if(selected === "Daily"){
        labelData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', `Sat`, `Sun`];
        incomeData = daysData.dailyIncome;
        expenseData = daysData.dailyExpense
    }else if(selected === "Monthly"){
        labelData = ["Week 1" ,"Week 2" ,"Week 3" ,"Week 4"];
        incomeData = weekData.weeklyIncome;
        expenseData = weekData.weeklyExpense;
    }else if(selected === "Yearly"){
        labelData = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        incomeData = monthData.monthlyIncome;
        expenseData = monthData.monthlyExpense;
    }

    myChart.data.labels = labelData;
    myChart.data.datasets[0].data = incomeData;
    myChart.data.datasets[1].data = expenseData;
    myChart.update()
}
updateChart('Daily');