import {HttpUtils} from "../../utils/http-utils";

export class ExpensesCreate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.expenseNameInput = document.getElementById('expenses-create');
        document.getElementById('create-btn').addEventListener('click', this.createExpense.bind(this));
        document.getElementById('cancel-btn').addEventListener('click', this.removeOnExpensesPage.bind(this));
    }

    validate() {
        let result = true;
        if (this.expenseNameInput.value) {
            this.expenseNameInput.classList.remove('is-invalid');
        } else {
            result = false;
            this.expenseNameInput.classList.add('is-invalid');
        }
        return result;
    }

    removeOnExpensesPage() {
        this.openNewRoute('/expenses');
    }

   async createExpense(e) {
        e.preventDefault()
        if (this.validate()) {
            const result = await HttpUtils.request('/categories/expense', 'POST', true, {
                title: this.expenseNameInput.value
            })
            if (result.response && result.response.title && !result.error) {
                console.log('Новая категория успешно создана');
                this.openNewRoute('/expenses')
            }
            if (result.error || !result.response || (result.response && result.response.error)) {
                return console.log('Не удалось осуществить запрос, попробуйте позже');
            }
        }
    }

}