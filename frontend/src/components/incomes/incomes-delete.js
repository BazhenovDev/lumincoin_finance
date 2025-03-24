import {HttpUtils} from "../../utils/http-utils.js";

export class ExpensesDelete {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        const url = new URLSearchParams(window.location.search);
        this.id = url.get('id');
        this.notRedirect();
        this.expenseDelete().then();
    }

    notRedirect() {
        window.history.pushState({}, '', '/expenses');
        this.openNewRoute('/expenses');
    }

    searchButtons() {
        this.deleteButton = document.getElementById('delete-btn')
        console.log(this.deleteButton);
    }

    async expenseDelete() {
        if (this.id) {
            const result = await HttpUtils.request(`/categories/expense/${this.id}`, 'DELETE', true);
        }
    }
}