const income = document.getElementById('income');
const balance = document.getElementById('balance');
const expense = document.getElementById('expenses');
const description = document.getElementById('description');
const amount = document.getElementById('amount');
const btn = document.querySelector('.add-btn');

let allTransactions = JSON.parse(localStorage.getItem('transaction')) || [];
updateUi();
updateChart();
transactionCard();

btn.addEventListener('click', (evt) => {
  const trType = document.querySelector('input[name= "transaction-type"]:checked');
  let date = new Date();
  let today = date.toISOString().split('T')[0];
  let type = trType.value;
  let desc = description.value;
  let amt = parseInt(amount.value);

  let allTransaction = JSON.parse(localStorage.getItem("transaction")) || [];
  let i = allTransaction.length;

  const transaction = {
    id: i,
    description: desc,
    amount: amt,
    date: today,
    type: type,

  }

  allTransaction.push(transaction);

  localStorage.setItem("transaction", JSON.stringify(allTransaction));

  updateUi();
  transactionCard();
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
function transactionCard() {
  let alltransaction = JSON.parse(localStorage.getItem('transaction')) || [];
  const tCardContainer = document.querySelector('.th-cards');

  tCardContainer.innerHTML = '';

  const notcard = `
    <div class="noTC">
        <div class="noT">No transaction yet</div>
    </div>`
  if (alltransaction.length === 0) {
    tCardContainer.innerHTML = notcard;
    return;
  }


  let allcard = '';
  for (let transaction of alltransaction.reverse()) {
    const card =
      `<div class="transaction-history  ${transaction.type}">
          <div class="section">
             <div class="detail">Description</div>
             <div class="descr">${transaction.description}</div>
             <div class="detail" id="type">${transaction.type}</div>
          </div>
          <div class="section">
             <div class="detail">Amount</div>
             <div class="right-elem">
                <div class="amt"><i class="fa-solid fa-indian-rupee-sign symbol2"></i> ${transaction.amount}</div>
                <div class="delt-btn" onclick="deleteTransaction(${transaction.id})"><i class="fa-solid fa-circle-xmark"></i></div>
          
             </div>
             <div class="detail" id="date">${transaction.date}</div>
           </div>
       </div>`;

    allcard += card;
  }
  tCardContainer.innerHTML = allcard;

}

function deleteTransaction(id) {
  console.log(`delt btn was clicked of id ${id}`);
  let allTransaction = JSON.parse(localStorage.getItem('transaction')) || [];

  allTransaction = allTransaction.filter(s => s.id !== id);
  localStorage.setItem('transaction', JSON.stringify(allTransaction));

  transactionCard();
  updateUi();
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
        backgroundColor: ['#1ee0a9', '#cb7c31', '#b0643c']
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
