const domElement = identifier => document.querySelector(`${identifier}`);

class Budget {
  constructor() {
    this.budgetInput = domElement('.budget-form-input');
    this.expenseAmount = domElement('.expense-amount');
    this.budgetAmount = domElement('.budget-amount');
    this.balanceAmount = domElement('.balance-amount');
    this.expenseName = domElement('.expense-name');
    this.expenseInput = domElement('.expense-form-input');
  }

  submitBudget = e => {
    e.preventDefault();
    const budgetInput = this.budgetInput.value;

    if (validateBudget(budgetInput)) {
      if (localStorage.getItem('budget') === null) {
        let budgetMoney = [parseInt(budgetInput)];
        localStorage.setItem('budget', JSON.stringify(budgetMoney));
      } else {
        let budgetMoney = JSON.parse(localStorage.getItem('budget'));
        budgetMoney = [parseInt(budgetInput)];
        localStorage.setItem('budget', JSON.stringify(budgetMoney));
      }
    }
    this.getBudget();
    this.getBalance();

    this.budgetInput.value = '';
  };

  submitExpense = e => {
    e.preventDefault();

    let obj = {
      name: this.expenseName.value,
      value: this.expenseInput.value
    };

    if (validateExpense(this.expenseName.value, this.expenseInput.value)) {
      if (localStorage.getItem('expenses') === null) {
        let expenses = [];
        expenses.push(obj);
        localStorage.setItem('expenses', JSON.stringify(expenses));
      } else {
        let expenses = JSON.parse(localStorage.getItem('expenses'));
        expenses.push(obj);
        localStorage.setItem('expenses', JSON.stringify(expenses));
      }
    }
    this.getExpense();
    this.getBalance();

    domElement('.expense-form').reset();
  };

  getExpense() {
    let expenses = JSON.parse(localStorage.getItem('expenses'));

    if (expenses !== null) {
      let row = `
        <table class="table">
                <thead>
                    <td>
                        <h3 class="heading expense-heading">Expense Title</h3>
                    </td>
                    <td>
                        <h3 class="heading value-heading">Value</h3>
                    </td>
                    <td></td>
                </thead>
      `;
      expenses.forEach(detail => {
        row += `
                
                <tr>
                <td>${detail.name}</td>
                <td>&#8358; ${detail.value}</td>
                <td>
                    <button class="btn btn-delete" onclick=deleteExpense('${expenses.indexOf(
                      detail
                    )}')>Delete</button>
                    <button class="btn btn-edit" onclick=editExpense('${expenses.indexOf(
                      detail
                    )}')>Edit</button>
                </td>
                </tr>
          `;
      });

      row += '</table>';

      domElement('.table-output').innerHTML = row;
    } else {
      domElement('.table-output').innerHTML = `<table class="table">
                <thead>
                    <td>
                        <h3 class="heading expense-heading">Expense Title</h3>
                    </td>
                    <td>
                        <h3 class="heading value-heading">Value</h3>
                    </td>
                    <td></td>
                </thead>`;
    }
  }

  getBudget() {
    let budget = JSON.parse(localStorage.getItem('budget'));
    if (budget !== null) {
      this.budgetAmount.textContent = budget[0];
    }
  }

  getBalance() {
    let budget = JSON.parse(localStorage.getItem('budget'));

    let expenses = JSON.parse(localStorage.getItem('expenses'));
    if (expenses !== null) {
      let total = expenses
        .map(expense => {
          return parseInt(expense.value);
        })
        .reduce((value, total) => {
          return total + value;
        }, 0);

      let balance = parseInt(budget - total);

      this.balanceAmount.textContent = balance || budget;
      this.expenseAmount.textContent = total;
    } else {
      this.balanceAmount.textContent = budget;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => handleBudget());

function handleBudget() {
  const budget = new Budget();
  budget.getExpense();
  budget.getBudget();
  budget.getBalance();

  domElement('.budget-form').addEventListener('submit', budget.submitBudget);

  domElement('.expense-form').addEventListener('submit', budget.submitExpense);
}

const deleteExpense = index => {
  const budget2 = new Budget();
  let expenses = JSON.parse(localStorage.getItem('expenses'));

  if (expenses !== null) {
    expenses.forEach((expense, i) => {
      if (
        expenses.indexOf(expense) === parseInt(index) &&
        confirm(`Do you want to delete ${expense.name} form list`)
      ) {
        expenses.splice(i, 1);
      }
    });

    localStorage.setItem('expenses', JSON.stringify(expenses));
    budget2.getBalance();
    budget2.getBudget();
    budget2.getExpense();
  }
};

const editExpense = index => {
  const budget2 = new Budget();
  let expenses = JSON.parse(localStorage.getItem('expenses'));

  if (expenses !== null) {
    expenses.forEach((expense, i) => {
      if (expenses.indexOf(expense) === parseInt(index)) {
        domElement('.expense-name').value = expense.name;
        domElement('.expense-form-input').value = expense.value;

        expenses.splice(i, 1);
      }
    });

    localStorage.setItem('expenses', JSON.stringify(expenses));
    budget2.getBalance();
    budget2.getBudget();
    budget2.getExpense();
  }
};

function validateBudget(budget) {
  if (budget === '' || budget < 0) {
    domElement(
      '.budget-error'
    ).innerHTML = `<p class="error">Budget can not be negative or empty</p>`;

    setTimeout(() => {
      domElement('.budget-error').innerHTML = '';
    }, 3000);

    return false;
  } else if (isNaN(budget)) {
    domElement(
      '.budget-error'
    ).innerHTML = `<p class="error">Budget must be a number</p>`;

    setTimeout(() => {
      domElement('.budget-error').innerHTML = '';
    }, 3000);

    return false;
  } else {
    return true;
  }
}

function validateExpense(name, value) {
  if (name === '' || value === '') {
    domElement(
      '.expense-error'
    ).innerHTML = `<p class="error">*Field can not be empty</p>`;

    setTimeout(() => {
      domElement('.expense-error').innerHTML = '';
    }, 3000);

    return false;
  } else if (isNaN(value)) {
    domElement(
      '.expense-error'
    ).innerHTML = `<p class="error">Expense amount must be a number</p>`;

    setTimeout(() => {
      domElement('.expense-error').innerHTML = '';
    }, 3000);

    return false;
  } else {
    return true;
  }
}
