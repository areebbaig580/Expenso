const income = document.getElementById('income');
const balance = document.getElementById('balance');
const expense = document.getElementById('expenses');
const description = document.getElementById('description');
const amount = document.getElementById('amount');
const btn = document.querySelector('.add-btn');

let allTransactions = JSON.parse(localStorage.getItem('transaction')) || [];
updateUi();
updateChart();

btn.addEventListener('click', (evt) => {
  const trType = document.querySelector('input[name= "transaction-type"]:checked');
  let inc = parseInt(income.innerHTML);
  let date = new Date();
  let today = date.toISOString().split('T')[0];
  let type = trType.value;
  let desc = description.value;
  let amt = parseInt(amount.value);

  const transaction = {
    description: desc,
    amount: amt,
    date: today,
    type: type,
  }

  let allTransaction = JSON.parse(localStorage.getItem("transaction")) || [];
  allTransaction.push(transaction);

  localStorage.setItem("transaction", JSON.stringify(allTransaction));

  updateUi();
  updateChart();

  description.value = '';
  amount.value = '';

});

function saveTransactions() {
  let allTransactions = JSON.parse(localStorage.getItem("transaction")) || [];
  let income = [];
  let expenses = [];

  for (let transaction of allTransactions) {
    if (transaction.type === "income") {
      income.push(transaction.amount);
    } else if (transaction.type === "expense") {
      expenses.push(transaction.amount);
    }
  }
  return { income, expenses }
}

function updateUi() {
  let allTransaction = JSON.parse(localStorage.getItem("transaction")) || [];

  let totalIncome = 0;
  let totalExpense = 0;

  for (let transaction of allTransaction) {
    if (transaction.type === "income") {
      totalIncome += transaction.amount;
    } else if (transaction.type === "expense") {
      totalExpense += transaction.amount;
    }
  }

  let bal = totalIncome - totalExpense;

  income.innerHTML = totalIncome;
  expense.innerHTML = totalExpense;
  balance.innerHTML = bal;

  localStorage.setItem("income", totalIncome);
  localStorage.setItem("expense", totalExpense);
  localStorage.setItem("balance", bal);
}

function updateChart() {
  const ctx = document.getElementById('myChart');
  let inc = localStorage.getItem("income");
  let exp = localStorage.getItem("expense");
  let bal = localStorage.getItem("balance"); 

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Balance', 'Expenses', 'Income'],
      datasets: [{
        data: [bal, exp, inc],
        backgroundColor: ['#1ee0a9', '#5fbca3', '#0f684a']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false
        }
      },
      cutout: '60%'
    }

  });
}
