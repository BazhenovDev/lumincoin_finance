import {HttpUtils} from "../../utils/http-utils.js";

export class ExpensesDelete {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        const url = new URLSearchParams(window.location.search);
        this.id = url.get('id');

        this.expenseDelete().then();
    }


    async expenseDelete() {
        if (this.id) {
            const result = await HttpUtils.request(`/categories/expense/${this.id}`, 'DELETE', true);

            if (result.redirect) {
                return this.openNewRoute(result.redirect);
            }

            if (!result || result.error || (result.response && result.response.error)) {
                return console.log('Произошла ошибка по удалению расхода');
            }
            return this.openNewRoute('/expenses');
        }
    }
}