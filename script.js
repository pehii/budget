document.addEventListener("DOMContentLoaded", () => {
    fetch("budget.json")
        .then(response => response.json())
        .then(data => initializeBudget(data));
});

function initializeBudget(data) {
    const budgetContainer = document.getElementById("budget-container");
    let totalIncome = 0;
    let totalExpenses = 0;

    data.items.forEach(item => {
        const budgetItem = document.createElement("div");
        budgetItem.className = "budget-item";
        if (item.completed) {
            budgetItem.classList.add("completed");
        }
        
        budgetItem.innerHTML = `
            <input type="checkbox" ${item.completed ? "checked" : ""} data-amount="${item.amount}" ${item.type === "income" ? 'data-type="income"' : 'data-type="expense"'}>
            <span>${item.description}</span>
            <span>${item.dueDate}</span>
            <span>${item.amount >= 0 ? `$${item.amount.toFixed(2)}` : `-$${Math.abs(item.amount).toFixed(2)}`}</span>
        `;

        budgetItem.querySelector("input").addEventListener("change", updateBudget);
        budgetContainer.appendChild(budgetItem);

        if (item.type === "income") {
            totalIncome += item.amount;
        } else if (item.type === "expense") {
            totalExpenses += item.amount;
        }
    });

    updateSummary(totalIncome, totalExpenses);
}

function updateBudget(event) {
    const checkbox = event.target;
    const amount = parseFloat(checkbox.dataset.amount);
    const type = checkbox.dataset.type;
    const budgetItem = checkbox.parentElement;

    if (checkbox.checked) {
        budgetItem.classList.add("completed");
    } else {
        budgetItem.classList.remove("completed");
    }

    let totalIncome = 0;
    let totalExpenses = 0;

    document.querySelectorAll(".budget-item").forEach(item => {
        const itemAmount = parseFloat(item.querySelector("input").dataset.amount);
        const itemType = item.querySelector("input").dataset.type;

        if (itemType === "income") {
            totalIncome += item.classList.contains("completed") ? 0 : itemAmount;
        } else if (itemType === "expense") {
            totalExpenses += item.classList.contains("completed") ? 0 : itemAmount;
        }
    });

    updateSummary(totalIncome, totalExpenses);
}

function updateSummary(totalIncome, totalExpenses) {
    document.getElementById("total-income").textContent = `$${totalIncome.toFixed(2)}`;
    document.getElementById("total-expenses").textContent = `$${totalExpenses.toFixed(2)}`;
    document.getElementById("after-expenses").textContent = `$${(totalIncome - totalExpenses).toFixed(2)}`;
}
