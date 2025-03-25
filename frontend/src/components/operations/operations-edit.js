import {HttpUtils} from "../../utils/http-utils";

export class OperationsEdit {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.formSelectTypeElement = document.getElementById('form-select-type');
        this.formSelectCategoryElement = document.getElementById('form-select-category');
        this.formAmountElement = document.getElementById('amountInput');
        this.formDateElement = document.getElementById('dateInput');
        this.formCommentElement = document.getElementById('commentInput');

        const url = new URLSearchParams(window.location.search)
        this.id = url.get('id')

        if (!this.id || isNaN(this.id)) {
            this.openNewRoute('/operations');
        }

        this.getOperation().then();


        document.getElementById('cancel').addEventListener('click', () => this.openNewRoute('/operations'));
        document.getElementById('create-operation').addEventListener('click', this.updateData.bind(this));
        this.formSelectTypeElement.addEventListener('change', this.loadCategories.bind(this))
    }

    async getOperation() {
        const response = await HttpUtils.request(`/operations/${this.id}`);
        if (response.response && !response.error) {
            for (let i = 0; i < this.formSelectTypeElement.options.length; i++) {
                if (this.formSelectTypeElement[i].value === response.response.type) {
                    this.formSelectTypeElement.selectedIndex = i;
                    this.getCategories(this.formSelectTypeElement.value, response.response.category).then();
                }
            }

            this.formAmountElement.value = response.response.amount;
            this.formDateElement.value = response.response.date;
            this.formCommentElement.value = response.response.comment;

            this.originalData = response.response;
        }
    }

    async getCategories(type, category) {
        if (type) {
            const response = await HttpUtils.request(`/categories/${type}`);
            if (response.response && !response.error) {
                response.response.forEach(category => {
                    const formOptionElement = document.createElement('option');
                    formOptionElement.innerText = category.title;
                    formOptionElement.value = category.id;
                    this.formSelectCategoryElement.append(formOptionElement);
                });
            }
            for (let i = 0; i < this.formSelectCategoryElement.options.length; i++) {
                if (this.formSelectCategoryElement[i].innerText === category) {
                    this.formSelectCategoryElement.selectedIndex = i;
                }
            }
        }
    }

    async loadCategories() {
        if (this.formSelectTypeElement.selectedIndex === 0) {
            this.formSelectCategoryElement.innerHTML = '';
            const responseIncome = await HttpUtils.request('/categories/income');

            if (responseIncome.response && !responseIncome.error) {
                responseIncome.response.forEach(income => {
                    const optionElement = document.createElement('option');
                    optionElement.value = income.id;
                    optionElement.innerText = income.title;
                    this.formSelectCategoryElement.append(optionElement);
                })
            } else {
                console.log('Произошла ошибка, не удалось получить категории');
            }
        } else if (this.formSelectTypeElement.selectedIndex === 1) {
            this.formSelectCategoryElement.innerHTML = '';
            const responseExpense = await HttpUtils.request('/categories/expense');

            if (responseExpense.response && !responseExpense.error) {
                responseExpense.response.forEach(expense => {
                    const optionElement = document.createElement('option');
                    optionElement.value = expense.id;
                    optionElement.innerText = expense.title;
                    this.formSelectCategoryElement.append(optionElement);
                })
            } else {
                console.log('Произошла ошибка, не удалось получить категории');
            }
        }
    }

    validateForm() {
        let result = true;

        if (this.formAmountElement.value) {
            this.formAmountElement.classList.remove('is-invalid');
        } else {
            result = false;
            this.formAmountElement.classList.add('is-invalid');
        }

        if (this.formDateElement.value) {
            this.formDateElement.classList.remove('is-invalid');
        } else {
            result = false;
            this.formDateElement.classList.add('is-invalid');
        }

        if (this.formCommentElement.value) {
            this.formCommentElement.classList.remove('is-invalid');
        } else {
            result = false;
            this.formCommentElement.classList.add('is-invalid');
        }

        return result;
    }

    async updateData(e) {
        e.preventDefault();
        const newData = {}
        if (this.validateForm()) {

            // if (this.originalData.type !== this.formSelectTypeElement.value) {
                newData.type = this.formSelectTypeElement.value;
            // }

            // if (this.originalData.category !== this.formSelectCategoryElement.value) {
                newData['category_id'] = +this.formSelectCategoryElement.value;
            // }

            // if (+this.originalData.amount !== +this.formAmountElement.value) {
                newData.amount = +this.formAmountElement.value;
            // }
            // if (this.originalData.date !== this.formDateElement.value) {
                newData.date = this.formDateElement.value
            // }
            // if (this.originalData.comment !== this.formCommentElement.value) {
                newData.comment = this.formCommentElement.value
            // }
        }

        if (Object.keys(newData).length > 0) {
            const response = await HttpUtils.request(`/operations/${this.id}`, 'PUT', true, newData);
            if (response.response && !response.error) {
                this.openNewRoute('/operations')
            } else {
                console.log(`Не удалось произвести изменение ${newData.type === 'income' ? 'дохода' : 'расхода'}, обратитесь в поддержку`);
            }
        }

    }

}