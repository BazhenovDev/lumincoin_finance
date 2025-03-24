import {HttpUtils} from "../../utils/http-utils";

export class OperationsList {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.tableBodyElement = document.getElementById('table-body');
        this.links = document.querySelectorAll('.nav-date .nav-link');
        this.dateElements = document.getElementById('date-elements');

        this.confirmDeleteButton = document.getElementById('confirmDeleteButton');
        this.cancelDeleteButton = document.getElementById('cancelDeleteButton');
        this.modalDeleteElement = document.getElementById('modal-delete');

        this.navigation();
    }

    navigation() {
        this.dateElements.style.opacity = '0';

        const dateFrom = document.getElementById('date-from');
        const dateTo = document.getElementById('date-to');

        dateFrom.addEventListener('change', () => {
            sessionStorage.setItem('dateFrom', dateFrom.value);
            this.tableBodyElement.innerHTML = '';
            return this.getOperations(`/operations?period=interval&dateFrom=${dateFrom.value}&dateTo=${dateTo.value}`).then();
        });
        dateFrom.value = sessionStorage.getItem('dateFrom');
        dateTo.addEventListener('change', () => {
            sessionStorage.setItem('dateTo', dateTo.value);
            this.tableBodyElement.innerHTML = '';
            return this.getOperations(`/operations?period=interval&dateFrom=${dateFrom.value}&dateTo=${dateTo.value}`).then();
        });
        dateTo.value = sessionStorage.getItem('dateTo');

        const dateFromItem = sessionStorage.getItem('dateFrom');
        const dateToItem = sessionStorage.getItem('dateTo');

        const pathname = window.location.href.replace(window.location.origin, '');


        this.links.forEach(activeLink => {

            activeLink.addEventListener('click', () => {
                activeLink.classList.remove('active');
                activeLink.classList.remove('disabled');
            });

            let linkPathname = activeLink.href.replace(window.location.origin, '');
            if (pathname === linkPathname) {
                activeLink.classList.add('disabled');
                activeLink.classList.add('active');
                this.getOperations(linkPathname).then();
                if (pathname.includes('period=interval')) {
                    this.dateElements.style.opacity = '1';
                    let url = new URL(window.location.href);
                    url.searchParams.append('dateFrom', dateFromItem);
                    url.searchParams.append('dateTo', dateToItem);
                    linkPathname = url.href.replace(window.location.origin, '');
                    console.log(linkPathname)
                    return this.getOperations(linkPathname).then();
                }
            }
        });
    }

    async getOperations(url) {
        const response = await HttpUtils.request(url);

        if (response.redirect) {
           return this.openNewRoute(response.redirect);
        }

        if (response.response && !response.error) {
            this.printTable(response.response);
        } else {
            console.log('Произошла ошибка запроса доходов и расходов. Обратитесь в поддержку');
        }
    }

    printTable(operations) {
        this.tableBodyElement.innerHTML = '';

        if (operations && operations.length > 0) {
            operations.sort((a, b) => a.id - b.id);

            operations.forEach(operation => {
                const trElement = document.createElement('tr');

                const tdIdOperationElement = document.createElement('td');
                tdIdOperationElement.classList.add('table-number');
                tdIdOperationElement.setAttribute('data-label', '№ операции:');
                tdIdOperationElement.innerText = operation.id;

                const tdTypeOperationElement = document.createElement('td');
                tdTypeOperationElement.classList.add('table-label');
                tdTypeOperationElement.setAttribute('data-label', 'Тип:');
                const type = operation.type;
                switch (type) {
                    case 'expense':
                        tdTypeOperationElement.classList.add('table-expenses');
                        tdTypeOperationElement.innerText = 'Расход';
                        break;
                    case 'income':
                        tdTypeOperationElement.classList.add('table-income');
                        tdTypeOperationElement.innerText = 'Доход';
                        break;
                    default:
                        tdTypeOperationElement.innerText = 'Неизвестно'
                        break;
                }

                const tdCategoryOperationElement = document.createElement('td');
                tdCategoryOperationElement.classList.add('table-label');
                tdCategoryOperationElement.setAttribute('data-label', 'Категория:');
                tdCategoryOperationElement.innerText = operation.category;

                const tdAmountOperationElement = document.createElement('td');
                tdAmountOperationElement.classList.add('table-label');
                tdAmountOperationElement.setAttribute('data-label', 'Сумма:');
                tdAmountOperationElement.innerText = `${operation.amount} $`;

                const tdDateOperationElement = document.createElement('td');
                tdDateOperationElement.classList.add('table-label');
                tdDateOperationElement.setAttribute('data-label', 'Дата:');
                const date = operation.date.split('-');
                const dateToUTC = new Date(Date.UTC(date[0], date[1] - 1, date[2]));
                tdDateOperationElement.innerText = dateToUTC.toLocaleDateString('ru-RU');

                const tdCommentOperationElement = document.createElement('td');
                tdCommentOperationElement.classList.add('table-label');
                tdCommentOperationElement.setAttribute('data-label', 'Комментарий:');
                tdCommentOperationElement.innerText = operation.comment;

                const tdToolsOperationElement = document.createElement('td');
                tdToolsOperationElement.classList.add('table-icons');

                const tdToolDeleteOperationElement = document.createElement('a');
                tdToolDeleteOperationElement.classList.add('table-icon');
                tdToolDeleteOperationElement.href = `javascript:void(0)`;
                tdToolDeleteOperationElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="bi bi-trash3" viewBox="0 0 16 16">
                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                </svg>`

                const tdToolEditOperationElement = document.createElement('a');
                tdToolEditOperationElement.classList.add('table-icon');
                tdToolEditOperationElement.href = `operations/edit?id=${operation.id}`
                tdToolEditOperationElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="bi bi-pencil" viewBox="0 0 16 16">
                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                </svg>`

                tdToolDeleteOperationElement.addEventListener('click', (event) => {
                    event.preventDefault();
                    this.confirmDeleteButton.href = `/operations/delete?id=${operation.id}`;
                    this.modalDeleteElement.classList.add('active');
                })

                this.cancelDeleteButton.addEventListener('click', (event) => {
                    event.preventDefault();
                    this.modalDeleteElement.classList.remove('active');
                })

                tdToolsOperationElement.append(tdToolDeleteOperationElement, tdToolEditOperationElement)

                trElement.append(tdIdOperationElement, tdTypeOperationElement, tdCategoryOperationElement, tdAmountOperationElement, tdDateOperationElement, tdCommentOperationElement, tdToolsOperationElement);
                this.tableBodyElement.append(trElement);
            })
        }
    }
}