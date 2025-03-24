import {HttpUtils} from "../../utils/http-utils";
import {ExpensesDelete} from "./expenses-delete";

export class ExpensesList {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.confirmDeleteButton = document.getElementById('confirmDeleteButton');
        this.cancelDeleteButton = document.getElementById('cancelDeleteButton');
        this.modalDeleteElement = document.getElementById('modal-delete');

        this.createExpenses().then();

    }

    async createExpenses() {
        const expenses = await HttpUtils.request('/categories/expense', 'GET', true);

        if (expenses.error) {
            console.log(expenses.response.message);
            return expenses.redirect ? this.openNewRoute(expenses.redirect) : null;
        }

        const expensesWrapper = document.querySelector('.card-wrapper');

        expenses.response.reverse();

        expenses.response.forEach(expense => {
            const cardWrapper = document.createElement('div');
            cardWrapper.classList.add('card');

            const cardBody = document.createElement('div');
            cardBody.classList.add('card-body');

            const cardTitle = document.createElement('h5');
            cardTitle.classList.add('card-title');
            cardTitle.innerText = expense.title;

            const editLink = document.createElement('a');
            editLink.classList.add('btn', 'btn-primary');
            editLink.innerText = 'Редактировать';
            editLink.href = `/expenses/edit?id=${expense.id}`;

            const deleteLink = document.createElement('a');
            deleteLink.classList.add('btn', 'btn-danger', 'btn-delete');
            deleteLink.innerText = 'Удалить';

            deleteLink.addEventListener('click', (event) => {
                event.preventDefault();
                this.modalDeleteElement.classList.add('active');
                this.confirmDeleteButton.href = `/expenses/delete?id=${expense.id}`
            });

            this.cancelDeleteButton.addEventListener('click', (event) => {
                event.preventDefault();
                this.modalDeleteElement.classList.remove('active');
            });

            cardBody.append(cardTitle);
            cardBody.append(editLink);
            cardBody.append(deleteLink);
            cardWrapper.append(cardBody);
            expensesWrapper.prepend(cardWrapper);
        });
    }
}