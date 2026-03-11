function setCurrentDate() {
    let today = new Date();
    let day = String(today.getDate()).padStart(2, '0');
    let month = String(today.getMonth() + 1).padStart(2, '0');
    let year = today.getFullYear();

    let currentDate = year + "-" + month + "-" + day;
    document.getElementById("date").value = currentDate;
}

function updateTotal() {
    let rows = document.querySelectorAll("#expenseTable tr");
    let total = 0;

    rows.forEach(function (row) {
        let amount = row.children[1].textContent;
        total += parseFloat(amount);
    });

    document.getElementById("Summary").innerHTML =
        "<h3>Total: ₹" + total + "</h3>";
}

window.addEventListener("DOMContentLoaded", function () {

    setCurrentDate();

    // 🔥 Load Saved Roommates
    let savedRoommates = JSON.parse(localStorage.getItem("roommates")) || [];
    savedRoommates.forEach(addRoommateToUI);

    // 🔥 Load Saved Expenses
    let savedExpenses = JSON.parse(localStorage.getItem("expenses")) || [];
    savedExpenses.forEach(addExpenseToUI);

    updateTotal();

    // 🔵 Add Roommate
    document.getElementById("addroommateBtn").addEventListener("click", function () {

        let nameInput = document.getElementById("roommateName");
        let name = nameInput.value.trim();
        if (name === "") return;

        addRoommateToUI(name);

        savedRoommates.push(name);
        localStorage.setItem("roommates", JSON.stringify(savedRoommates));

        nameInput.value = "";
    });

    // 🟢 Add Expense
    document.getElementById("addExpenseBtn").addEventListener("click", function () {

        let payer = document.getElementById("payer").value;
        let amount = document.getElementById("addAmount").value;
        let date = document.getElementById("date").value;
        let description = document.getElementById("description").value;

        if (payer === "" || amount === "") return;

        let expense = { payer, amount, date, description };

        addExpenseToUI(expense);

        savedExpenses.push(expense);
        localStorage.setItem("expenses", JSON.stringify(savedExpenses));

        document.getElementById("addAmount").value = "";
        document.getElementById("description").value = "";

        setCurrentDate();
        updateTotal();
    });

    // 🔴 Reset All
    document.getElementById("resetBtn").addEventListener("click", function () {

        if (!confirm("Are you sure you want to reset everything?")) return;

        localStorage.clear();

        document.getElementById("roommateList").innerHTML = "";
        document.getElementById("expenseTable").innerHTML = "";
        document.getElementById("payer").innerHTML =
            '<option value="" disabled selected>Choose roommate</option>';
        document.getElementById("Summary").innerHTML = "";

        setCurrentDate();
    });

});

function addRoommateToUI(name) {
    let li = document.createElement("li");
    li.textContent = name;
    document.getElementById("roommateList").appendChild(li);

    let option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    document.getElementById("payer").appendChild(option);
}

function addExpenseToUI(expense) {

    let row = document.createElement("tr");

    row.innerHTML = `
        <td>${expense.payer}</td>
        <td>${expense.amount}</td>
        <td>${expense.date}</td>
        <td>${expense.description}</td>
        <td><button class="deleteBtn">Delete</button></td>
    `;

    row.querySelector(".deleteBtn").addEventListener("click", function () {
        row.remove();
        updateTotal();

        let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
        expenses = expenses.filter(e =>
            !(e.payer === expense.payer &&
              e.amount === expense.amount &&
              e.date === expense.date &&
              e.description === expense.description)
        );

        localStorage.setItem("expenses", JSON.stringify(expenses));
    });

    document.getElementById("expenseTable").appendChild(row);
}
