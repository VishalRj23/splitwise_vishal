// script.js

let people = []; // Store people
let expenses = []; // Store expenses

function addPerson() {
    const nameInput = document.getElementById("personName");
    const name = nameInput.value.trim();

    if (name !== "" && !people.includes(name)) {
        people.push(name);
        nameInput.value = "";
        updatePeopleList();
        updatePaidBySelect();
        updateSplitWithList();
    }
}

function updatePeopleList() {
    const ul = document.getElementById("peoplelist");
    ul.innerHTML = "";
    people.forEach(person => {
        const li = document.createElement("li");
        li.textContent = person;
        ul.appendChild(li);
    });
}

function updatePaidBySelect() {
    const select = document.getElementById("paidBy");
    select.innerHTML = "";
    people.forEach(person => {
        const option = document.createElement("option");
        option.value = person;
        option.textContent = person;
        select.appendChild(option);
    });
}

function updateSplitWithList() {
    const container = document.getElementById("splitwithlist");
    container.innerHTML = "";
    people.forEach(person => {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = person;
        checkbox.id = `split-${person}`;

        const label = document.createElement("label");
        label.htmlFor = checkbox.id;
        label.textContent = person;

        container.appendChild(checkbox);
        container.appendChild(label);
        container.appendChild(document.createElement("br"));
    });
}

function addExpense() {
    const amount = parseFloat(document.getElementById("amount").value);
    const description = document.getElementById("description").value.trim();
    const paidBy = document.getElementById("paidBy").value;

    const splitWith = [];
    people.forEach(person => {
        const checkbox = document.getElementById(`split-${person}`);
        if (checkbox && checkbox.checked) {
            splitWith.push(person);
        }
    });

    if (amount > 0 && description !== "" && paidBy !== "" && splitWith.length > 0) {
        expenses.push({ amount, description, paidBy, splitWith });
        calculateBalances();
        document.getElementById("amount").value = "";
        document.getElementById("description").value = "";
    }
}

function calculateBalances() {
    const balances = {};
    people.forEach(person => balances[person] = 0);

    expenses.forEach(exp => {
        const share = exp.amount / exp.splitWith.length;
        exp.splitWith.forEach(person => {
            if (person !== exp.paidBy) {
                balances[person] -= share;
                balances[exp.paidBy] += share;
            }
        });
    });

    const list = document.getElementById("balanceslist");
    list.innerHTML = "";
    for (let person in balances) {
        const li = document.createElement("li");
        li.textContent = `${person} ${balances[person] >= 0 ? 'gets' : 'owes'} ₹${Math.abs(balances[person]).toFixed(2)}`;
        list.appendChild(li);
    }
}
