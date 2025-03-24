import {HttpUtils} from "../../utils/http-utils";

export class IncomeList {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.confirmDeleteButton = document.getElementById('confirmDeleteButton');
        this.cancelDeleteButton = document.getElementById('cancelDeleteButton');
        this.modalDeleteElement = document.getElementById('modal-delete');

        this.init().then();

    }

    async init() {
        const incomes = await HttpUtils.request('/categories/income', 'GET', true);

        if (incomes.error) {
            console.log(incomes.response.message);
            return incomes.redirect ? this.openNewRoute(incomes.redirect) : null;
        }

        const incomesWrapper = document.querySelector('.card-wrapper');

        incomes.response.reverse();

        incomes.response.forEach(income => {
            const cardWrapper = document.createElement('div');
            cardWrapper.classList.add('card');

            const cardBody = document.createElement('div');
            cardBody.classList.add('card-body');

            const cardTitle = document.createElement('h5');
            cardTitle.classList.add('card-title');
            cardTitle.innerText = income.title;

            const editLink = document.createElement('a');
            editLink.classList.add('btn', 'btn-primary');
            editLink.innerText = 'Редактировать';
            editLink.href = `/income/edit?id=${income.id}`;

            const deleteLink = document.createElement('a');
            deleteLink.classList.add('btn', 'btn-danger', 'btn-delete');
            deleteLink.innerText = 'Удалить';


            deleteLink.addEventListener('click', (event) => {
                event.preventDefault();
                this.modalDeleteElement.classList.add('active');
                this.confirmDeleteButton.href = `/income/delete?id=${income.id}`
            });

            this.cancelDeleteButton.addEventListener('click', (event) => {
                event.preventDefault();
                this.modalDeleteElement.classList.remove('active');
            });

            cardBody.append(cardTitle);
            cardBody.append(editLink);
            cardBody.append(deleteLink);
            cardWrapper.append(cardBody);
            incomesWrapper.prepend(cardWrapper);

        });
    }



}