const ctx = document.getElementById('myChart');
const balance = document.getElementById('balance');
const income = document.getElementById('income');
const expense = document.getElementById('expenses');
const description = document.getElementById('description');
const amount = document.getElementById('amount');
const btn = document.querySelector('.add-btn');


btn.addEventListener('click', (evt)=>{
    desc = description.value;
    amt = amount.value;
    console.log(desc);
    console.log(amt);
    
    description.value= '';
    amount.value = '';

})

new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: ['Balance', 'Expenses','income'],
    datasets: [{
      data: [1,1,1],
      backgroundColor: ['#1ee0a9', '#ffff', '#757575']
    }]
  }
});
