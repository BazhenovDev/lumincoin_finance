import {HttpUtils} from "../../utils/http-utils.js";

export class IncomeDelete {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        const url = new URLSearchParams(window.location.search);
        this.id = url.get('id');

        this.incomeDelete().then();
    }
    async incomeDelete() {
        if (this.id) {
            const result = await HttpUtils.request(`/categories/income/${this.id}`, 'DELETE', true);

            if (result.redirect) {
                return this.openNewRoute(result.redirect);
            }

            if (!result || result.error || (result.response && result.response.error)) {
               return console.log('Произошла ошибка по удалению дохода');
            }
           return this.openNewRoute('/income');
        }
    }
}