const ctx = document.getElementById('myChart');
const income = document.getElementById('income');
const balance = document.getElementById('balance');
const expense = document.getElementById('expenses');
const description = document.getElementById('description');
const amount = document.getElementById('amount');
const btn = document.querySelector('.add-btn');

let allTransactions = JSON.parse(localStorage.getItem('transaction')) || [];
updateUi();

btn.addEventListener('click', (evt) => {
  const trType = document.querySelector('input[name= "transaction-type"]:checked');
  let inc = parseInt(income.innerHTML);
  let date = new Date();
  let today = date.toISOString().split('T')[0];
  let type = trType.value;
  let desc = description.value;
  let amt = parseInt(amount.value);

  if (inc === 0.00 || isNaN(inc)) {
    amt = amt;
  } else {
    amt = inc + amt;
  }

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
  
  description.value = '';
  amount.value = '';

});

function saveTransactions() {
  let allTransactions = JSON.parse(localStorage.getItem("transaction")) || [];
  let income = [];
  let expenses = [];

  for(let transaction of allTransactions){
    if(transaction.type === "income"){
      income.push(transaction.amount);
    }else if(transaction.type === "expense"){
      expenses.push(transaction.amount);
    }
  }
  return {income, expenses}
}

function updateUi() {
  let allTransaction = JSON.parse(localStorage.getItem("transaction"));
  
  let totalIncome = 0;
  let totalExpense = 0;

  for(let transaction of allTransaction){
    if(transaction.type === "income"){
      totalIncome += transaction.amount;
    }else if(transaction.type === "expense"){
      totalExpense += transaction.amount;
    }
  }

  let bal = totalIncome - totalExpense; 

  income.innerHTML = totalIncome;
  expense.innerHTML = totalExpense;
  balance.innerHTML = bal;

}

new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: ['Balance', 'Expenses', 'income'],
    datasets: [{
      data: [1, 1, 1],
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
