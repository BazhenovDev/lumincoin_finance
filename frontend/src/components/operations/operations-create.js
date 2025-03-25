import {HttpUtils} from "../../utils/http-utils";

export class OperationsCreate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.formSelectTypeElement = document.getElementById('form-select-type');
        this.formSelectCategoryElement = document.getElementById('form-select-category');
        this.formAmountElement = document.getElementById('amountInput');
        this.formDateElement = document.getElementById('dateInput');
        this.formCommentElement = document.getElementById('commentInput');

        const url = new URLSearchParams(window.location.search);
        const category = url.get('category');

        if (category) {
            switch (category) {
                case 'income':
                    this.formSelectTypeElement.selectedIndex = 0;
                    this.loadCategories().then();
                    break;
                case 'expense':
                    this.formSelectTypeElement.selectedIndex = 1;
                    this.loadCategories().then();
                    break;
            }
        }

        document.getElementById('cancel').addEventListener('click', () => this.openNewRoute('/operations'));
        document.getElementById('create-operation').addEventListener('click', this.sendData.bind(this));
        this.formSelectTypeElement.addEventListener('change', this.loadCategories.bind(this));
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

    async loadCategories() {

        // if (this.formSelectTypeElement.selectedIndex === 0) {
        //     this.formSelectCategoryElement.innerHTML = '';
        //     const responseIncome = await HttpUtils.request('/categories/income');
        //
        //     if (responseIncome.response && !responseIncome.error) {
        //         responseIncome.response.forEach(income => {
        //             const optionElement = document.createElement('option');
        //             optionElement.value = income.id;
        //             optionElement.innerText = income.title;
        //             this.formSelectCategoryElement.append(optionElement);
        //         })
        //     } else {
        //         console.log('Произошла ошибка, не удалось получить категории');
        //     }
        // } else if (this.formSelectTypeElement.selectedIndex === 1) {
        //     this.formSelectCategoryElement.innerHTML = '';
        //     const responseExpense = await HttpUtils.request('/categories/expense');
        //
        //     if (responseExpense.response && !responseExpense.error) {
        //         responseExpense.response.forEach(expense => {
        //             const optionElement = document.createElement('option');
        //             optionElement.value = expense.id;
        //             optionElement.innerText = expense.title;
        //             this.formSelectCategoryElement.append(optionElement);
        //         })
        //     } else {
        //         console.log('Произошла ошибка, не удалось получить категории');
        //     }
        // }


            this.formSelectCategoryElement.innerHTML = '';
            const response = this.formSelectTypeElement.selectedIndex === 0
                ? await HttpUtils.request('/categories/income')
                : await HttpUtils.request('/categories/expense');

            if (response.response && !response.error) {
                response.response.forEach(item => {
                    const optionElement = document.createElement('option');
                    optionElement.value = item.id;
                    optionElement.innerText = item.title;
                    this.formSelectCategoryElement.append(optionElement);
                })
            } else {
                console.log('Произошла ошибка, не удалось получить категории');
            }
    }

    async sendData(e) {
        e.preventDefault();
        if (this.validateForm()) {
            const response = await HttpUtils.request('/operations', 'POST', true, {
                type: this.formSelectTypeElement.value,
                amount: this.formAmountElement.value,
                date: this.formDateElement.value,
                comment: this.formCommentElement.value,
                category_id: +this.formSelectCategoryElement.value
            })
            if (response && !response.error) {
                this.openNewRoute('/operations?period=today');
            } else {
                console.log(`Не удалось создать ${this.formSelectTypeElement.value === 'income' ? 'Доход' : 'Расход'}`);
            }
        }

    }

}