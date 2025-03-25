import {HttpUtils} from "../../utils/http-utils";

export class IncomesEdit {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        const url = new URLSearchParams(window.location.search);
        const incomeId = url.get('id');

        if (!incomeId) {
            return this.openNewRoute('/income');
        }

        this.inputNameElement = document.getElementById('income-create');

        this.getIncome(incomeId).then();

        document.getElementById('edit-btn').addEventListener('click', this.update.bind(this));
        document.getElementById('cancel-btn').addEventListener('click', () => {
            this.inputNameElement.value = this.getIncomeResult.title;
            this.openNewRoute('/income');
        });

    }

    async getIncome(id) {
        const result = await HttpUtils.request(`/categories/income/${id}`);

        if (result.redirect) {
           return this.openNewRoute(result.redirect);
        }

        if (result && !result.error) {
            this.inputNameElement.value = result.response.title;
        }

        if (result.error || !result.response || (result.response && result.response.error)) {
            console.log('Произошла ошибка запроса расхода');
        }

        this.getIncomeResult = result.response;
    }

    validateForm() {
        let result = true;

        if (this.inputNameElement.value) {
           this.inputNameElement.classList.remove('is-invalid');
        } else {
           this.inputNameElement.classList.add('is-invalid');
           result = false;
        }
        return result;
    }

    async update(e) {
        e.preventDefault();

        if (this.validateForm()) {
            if (this.inputNameElement.value !== this.getIncomeResult.title) {
                const result = await HttpUtils.request(`/categories/income/${this.getIncomeResult.id}`, 'PUT', true, {
                    title: this.inputNameElement.value
                });

                if (result.response && !result.error) {
                    console.log('Название категории успешно обновилось');
                    return this.openNewRoute('/income');
                }

                if (result.error || !result.response || (result.response && result.response.error)) {
                    return console.log('Название категории не удалось обновить. Попробуйте позже.');
                }

            }
        }
    }

}
