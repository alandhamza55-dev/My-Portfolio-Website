let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let customers = JSON.parse(localStorage.getItem("customers")) || [];
let inventory = JSON.parse(localStorage.getItem("inventory")) || [];

function saveData(){
    localStorage.setItem("transactions", JSON.stringify(transactions));
    localStorage.setItem("customers", JSON.stringify(customers));
    localStorage.setItem("inventory", JSON.stringify(inventory));
}

function showSection(section){
    document.querySelectorAll("section").forEach(sec=>sec.classList.add("d-none"));
    document.getElementById(section).classList.remove("d-none");
}

function addTransaction(){
    let desc = document.getElementById("desc").value;
    let amount = Number(document.getElementById("amount").value);
    let type = document.getElementById("type").value;

    transactions.push({desc, amount, type});
    saveData();
    renderTransactions();
    updateDashboard();
}

function renderTransactions(){
    let table = document.getElementById("transactionTable");
    table.innerHTML = "";

    transactions.forEach((t,i)=>{
        table.innerHTML += `
        <tr>
            <td>${t.desc}</td>
            <td>${t.amount}</td>
            <td>${t.type}</td>
            <td><button onclick="deleteTransaction(${i})" class="btn btn-sm btn-danger">Delete</button></td>
        </tr>`;
    });
}

function deleteTransaction(i){
    transactions.splice(i,1);
    saveData();
    renderTransactions();
    updateDashboard();
}

function updateDashboard(){
    let income = transactions.filter(t=>t.type==="Income")
        .reduce((a,b)=>a+b.amount,0);
    let expense = transactions.filter(t=>t.type==="Expense")
        .reduce((a,b)=>a+b.amount,0);

    document.getElementById("totalIncome").innerText = income;
    document.getElementById("totalExpense").innerText = expense;
    document.getElementById("netProfit").innerText = income-expense;

    lineChart.data.datasets[0].data=[income,expense];
    pieChart.data.datasets[0].data=[income,expense];
    lineChart.update();
    pieChart.update();
}

function addCustomer(){
    let name=document.getElementById("customerName").value;
    customers.push(name);
    saveData();
    document.getElementById("customerList").innerHTML +=
        `<li class="list-group-item">${name}</li>`;
}

function addItem(){
    let name=document.getElementById("itemName").value;
    let qty=document.getElementById("itemQty").value;
    inventory.push({name,qty});
    saveData();
    document.getElementById("inventoryList").innerHTML +=
        `<li class="list-group-item">${name} - ${qty}</li>`;
}

const lineChart=new Chart(document.getElementById("lineChart"),{
    type:"line",
    data:{
        labels:["Income","Expense"],
        datasets:[{
            label:"Financial Overview",
            data:[0,0],
            borderColor:"#007bff"
        }]
    }
});

const pieChart=new Chart(document.getElementById("pieChart"),{
    type:"pie",
    data:{
        labels:["Income","Expense"],
        datasets:[{
            data:[0,0],
            backgroundColor:["#28a745","#dc3545"]
        }]
    }
});

function generatePDF(){
    const { jsPDF } = window.jspdf;
    const doc=new jsPDF();
    doc.text("ERP Financial Report",20,20);
    doc.save("financial-report.pdf");
}

renderTransactions();
updateDashboard();