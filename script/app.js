const domElement = identifier => document.querySelector(`${identifier}`);

class Budget {
  constructor() {
    //accses the DOM element
    this.budgetInput = domElement('.budget-form-input');
    this.expenseAmount = domElement('.expense-amount');
    this.budgetAmount = domElement('.budget-amount');
    this.balanceAmount = domElement('.balance-amount');
    this.expenseName = domElement('.expense-name');
    this.expenseInput = domElement('.expense-form-input');
  }

  //method to handle the submitted budget details
  submitBudget = e => {
    e.preventDefault();
    const budgetMoney = [parseInt(this.budgetInput.value)];

    const budget = JSON.parse(localStorage.getItem('budget'));

    if (validateBudget(this.budgetInput.value)) {
      if (budget !== null) {
        localStorage.setItem('budget', JSON.stringify(budgetMoney));
      } else {
        let budgetMoney = [];
        budgetMoney = [parseInt(this.budgetInput.value)];
        localStorage.setItem('budget', JSON.stringify(budgetMoney));
      }
    }
    this.displayBudget();
    this.getBalance();

    this.budgetInput.value = '';
  };

  /* Method to handle the submitted Expense details */

  submitExpense = e => {
    e.preventDefault();

    //Object comprising of the expenses value
    let expense_Store = {
      name: this.expenseName.value,
      value: this.expenseInput.value
    };

    const expenses = this.getExpense();
    /* validation check on the Expenses input value */
    if (validateExpense(expense_Store.name, expense_Store.value)) {
      if (expenses !== null) {
        expenses.push(expense_Store);
        localStorage.setItem('expenses', JSON.stringify(expenses));
      } else {
        let expenses = [];
        expenses.push(expense_Store);
        localStorage.setItem('expenses', JSON.stringify(expenses));
      }
    }
    this.displayExpense();
    this.getBalance();

    //reset the form after submittion

    domElement('.expense-form').reset();
  };

  /* get the Expenses form local storage */

  getExpense() {
    const expenses = JSON.parse(localStorage.getItem('expenses'));
    return expenses;
  }

  /* Display Expense onto the DOM */
  displayExpense() {
    const expenses = this.getExpense();

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
                <div  class="btn-control">
                    <button class="btn btn-delete" onclick=deleteExpense('${expenses.indexOf(
                      detail
                    )})')>Delete</button>

                    <button class="btn btn-edit" onclick = editExpense('${expenses.indexOf(
                      detail
                    )})')>Edit</button>
                  </div>
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

  //get buget from local storage
  getBudget() {
    const budget = JSON.parse(localStorage.getItem('budget'));
    return budget;
  }

  //Display budget data to the DOM

  displayBudget() {
    const budget = this.getBudget();
    if (budget !== null) {
      this.budgetAmount.textContent = budget[0];
    }
  }

  /* Calculate the balance and display to the DOM */

  getBalance() {
    let budget = this.getBudget();

    let expenses = this.getExpense();
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

/* As soon as the DOM loads, initialize the handle budget function */

document.addEventListener('DOMContentLoaded', () => handleBudget());
const budget = new Budget();

function handleBudget() {
  budget.displayExpense();
  budget.displayBudget();
  budget.getBalance();

  domElement('.budget-form').addEventListener('submit', budget.submitBudget);

  domElement('.expense-form').addEventListener('submit', budget.submitExpense);
}

/* function to delete Expense form the DOM */

function deleteExpense(index) {
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
    budget.getBalance();
    budget.displayBudget();
    budget.displayExpense();
  }
}

/* function to edit expense */

const editExpense = index => {
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
    budget.getBalance();
    budget.getBudget();
    budget.displayExpense();
  }
};

/* Function to validate form input */
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
    ).innerHTML = `<p class="error">*Budget must be a number</p>`;

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
