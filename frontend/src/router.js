import {MainPage} from "./components/main-page.js";
import {LoginPage} from "./components/auth/login-page.js";
import {IncomeList} from "./components/incomes/income-list.js";
import {LogoutPage} from "./components/auth/logout-page.js";
import {SignupPage} from "./components/auth/signup-page.js";
import {AuthUtils} from "./utils/auth-utils.js";
import {HttpUtils} from "./utils/http-utils.js";
import {CheckAuthUtils} from "./utils/check-auth-utils.js";
import {ExpensesList} from "./components/expenses/expenses-list";
import {ExpensesEdit} from "./components/expenses/expenses-edit";
import {ExpensesDelete} from "./components/expenses/expenses-delete";
import {ExpensesCreate} from "./components/expenses/expenses-create";
import {IncomesCreate} from "./components/incomes/incomes-create";
import {IncomesEdit} from "./components/incomes/income-edit";
import {IncomeDelete} from "./components/incomes/incomes-delete";
import {OperationsList} from "./components/operations/operations-list";
import {OperationsCreate} from "./components/operations/operations-create";
import {OperationsEdit} from "./components/operations/operations-edit";
import {OperationsDelete} from "./components/operations/operations-delete";

export class Router {
    constructor() {

        this.loadPageEvent();
        this.contentPageElement = document.getElementById('content');
        this.titlePageElement = document.getElementById('title');

        this.route = [
            {
                title: 'Главная страница',
                route: '/',
                filePathTemplate: '/templates/pages/main.html',
                layout: '/templates/layout.html',
                load: () => {
                    new CheckAuthUtils(this.openNewRoute.bind(this));
                    new MainPage(this.openNewRoute.bind(this));
                },
            },
            {
                title: 'Такой страницы нет',
                route: '/404',
                filePathTemplate: '/templates/pages/404.html',
            },
            {
                title: 'Страница авторизации',
                route: '/login',
                filePathTemplate: '/templates/pages/auth/login.html',
                load: () => {
                    new LoginPage(this.openNewRoute.bind(this));
                },
            },
            {
                title: 'Страница регистрации',
                route: '/signup',
                filePathTemplate: '/templates/pages/auth/signup.html',
                load: () => {
                    new SignupPage(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/logout',
                load: () => {
                    new LogoutPage(this.openNewRoute.bind(this));
                },
            },
            {
                title: 'Страница доходов',
                route: '/income',
                filePathTemplate: '/templates/pages/incomes/income.html',
                layout: '/templates/layout.html',
                load: () => {
                    new CheckAuthUtils(this.openNewRoute.bind(this));
                    new IncomeList();
                },
            },
            {
                title: 'Создание категории доходов',
                route: '/income/create',
                filePathTemplate: '/templates/pages/incomes/income-create.html',
                layout: '/templates/layout.html',
                load: () => {
                    new CheckAuthUtils(this.openNewRoute.bind(this));
                    new IncomesCreate(this.openNewRoute.bind(this));
                },
            },
            {
                title: 'Редактирование категории доходов',
                route: '/income/edit',
                filePathTemplate: '/templates/pages/incomes/income-edit.html',
                layout: '/templates/layout.html',
                load: () => {
                    new CheckAuthUtils(this.openNewRoute.bind(this));
                    new IncomesEdit(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/income/delete',
                load: () => {
                    new CheckAuthUtils(this.openNewRoute.bind(this));
                    new IncomeDelete(this.openNewRoute.bind(this));
                },
            },
            {
                title: 'Расходы',
                route: '/expenses',
                filePathTemplate: '/templates/pages/expenses/expenses.html',
                layout: '/templates/layout.html',
                load: () => {
                    new CheckAuthUtils(this.openNewRoute.bind(this));
                    new ExpensesList(this.openNewRoute.bind(this));
                },
            },
            {
                title: 'Создание категории расхода',
                route: '/expenses/create',
                filePathTemplate: '/templates/pages/expenses/expenses-create.html',
                layout: '/templates/layout.html',
                load: () => {
                    new CheckAuthUtils(this.openNewRoute.bind(this));
                    new ExpensesCreate(this.openNewRoute.bind(this));
                },
            },
            {
                title: 'Редактирование категории расхода',
                route: '/expenses/edit',
                filePathTemplate: '/templates/pages/expenses/expenses-edit.html',
                layout: '/templates/layout.html',
                load: () => {
                    new CheckAuthUtils(this.openNewRoute.bind(this));
                    new ExpensesEdit(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/expenses/delete',
                load: () => {
                    new CheckAuthUtils(this.openNewRoute.bind(this));
                    new ExpensesDelete(this.openNewRoute.bind(this));
                },
            },
            {
                title: 'Доходы и расходы',
                route: '/operations',
                filePathTemplate: '/templates/pages/operations/operations.html',
                layout: '/templates/layout.html',
                load: () => {
                    new CheckAuthUtils(this.openNewRoute.bind(this));
                    new OperationsList(this.openNewRoute.bind(this));
                },
            },
            {
                title: 'Создание дохода/расхода',
                route: '/operations/create',
                filePathTemplate: '/templates/pages/operations/operations-create.html',
                layout: '/templates/layout.html',
                load: () => {
                    new CheckAuthUtils(this.openNewRoute.bind(this));
                    new OperationsCreate(this.openNewRoute.bind(this));
                },
            },
            {
                title: 'Редактирование дохода/расхода',
                route: '/operations/edit',
                filePathTemplate: '/templates/pages/operations/operations-edit.html',
                layout: '/templates/layout.html',
                load: () => {
                    new CheckAuthUtils(this.openNewRoute.bind(this));
                    new OperationsEdit(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/operations/delete',
                load: () => {
                    new OperationsDelete(this.openNewRoute.bind(this));
                },
            },
        ];
    }

    loadPageEvent() {
        window.addEventListener('DOMContentLoaded', this.openRoute.bind(this))
        window.addEventListener('popstate', this.openRoute.bind(this))
        document.addEventListener('click', this.clickTracking.bind(this))
    }

    async clickTracking(event) {
        let link = null;

        if (event.target.tagName === 'A') {
            link = event.target;
        } else if (event.target.parentNode.tagName === 'A') {
            link = event.target.parentNode;
        }

        if (link) {
            event.preventDefault();
            const url = link.href.replace(window.location.origin, '');
            const currentRoute = window.location.pathname;

            if (!url || url === '/#' || url.startsWith('javascript:void(0)') || currentRoute === url.replace('#', '')) {
                return;
            }

            await this.openNewRoute(url)
        }
    }

    async openNewRoute(url) {
        const currentRoute = window.location.pathname

        history.pushState({}, '', url);

        await this.openRoute(null, currentRoute);
    }

    async openRoute(e, oldRoute = null) {
        const urlRoute = window.location.pathname;
        const currentRoute = this.route.find(route => route.route === urlRoute);

        if (currentRoute) {
            this.titlePageElement.innerText = `${currentRoute.title} | Lumincoin Finance`
            if (currentRoute.layout) {
                this.contentPageElement.innerHTML = await fetch(currentRoute.layout)
                    .then(response => response.text());
                document.getElementById('content-wrapper').innerHTML = await fetch(currentRoute.filePathTemplate)
                    .then(response => response.text());
                this.layoutElement = document.getElementById('layout-wrapper');
                this.burgerElement = document.getElementById('burger');
                this.burgerElement.addEventListener('click', () => {
                    this.burgerElement.classList.toggle('active');
                    this.layoutElement.classList.toggle('show');
                });

                this.activateMenuLink(currentRoute);

                this.showCollapse();

                this.showBalance().then();

                const userInfo = AuthUtils.getUserInfo(AuthUtils.userInfoKey);

                if (!userInfo) {
                    AuthUtils.removeUserInfo();
                } else {
                    document.querySelector('.layout-user-name').innerText = `${userInfo.name} ${userInfo.lastName}`
                    document.getElementById('user-label').addEventListener('click', () => {
                        document.getElementById('dropdown-logout').classList.toggle('show');
                    });
                }
            } else {
                this.contentPageElement.innerHTML = await fetch(currentRoute.filePathTemplate)
                    .then(response => response.text())
            }

            if (currentRoute.load && typeof currentRoute.load === 'function') {
                currentRoute.load();
            }

        } else {
            history.pushState({}, '', '/404');
            await this.openRoute();
        }
    }

    activateMenuLink(currentRoute) {
        const linksMenu = document.querySelectorAll('.menu-links .nav-link');
        linksMenu.forEach(link => {

            const href = link.getAttribute('href');
            if ((currentRoute.route.includes(href) && href !== '/') || (currentRoute.route === '/' && href === '/')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        const collapseMenu = document.querySelectorAll('#dashboard-collapse .collapse-link');

        collapseMenu.forEach(link => {
            const href = link.getAttribute('href');
            if ((currentRoute.route.includes(href) && href !== '/') || (currentRoute.route === '/' && href === '/')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    showCollapse() {
        const collapseButton = document.getElementById('collapse-button');
        const collapseDashboard = document.getElementById('dashboard-collapse');
        collapseDashboard.style.transition = 'all .25s';


        let booleanToggleForArrow = true;

        const currentPath = window.location.href.replace(window.location.origin, '');
        if (currentPath.includes('/expenses') || currentPath.includes('/income')) {
            collapseButton.setAttribute('aria-expanded', booleanToggleForArrow);
            collapseDashboard.style.opacity = '1';
            collapseDashboard.style.display = 'block';
        }

        collapseButton.addEventListener('click', () => {
            collapseButton.setAttribute('aria-expanded', booleanToggleForArrow);
            if (booleanToggleForArrow) {
                collapseDashboard.style.opacity = '1';
            } else {
                collapseDashboard.style.opacity = '0';
            }
            booleanToggleForArrow = !booleanToggleForArrow;
        });
    }

    async showBalance() {
        const result = await HttpUtils.request('/balance');
        if (result.response && !result.redirect) {
            this.balance = result.response.balance
            this.balanceSum = document.getElementById('layout-balance-sum');
            this.balanceSumInPopup = document.getElementById('balance-popup');
            this.balanceSum.innerText = this.balance.toString();
            this.balanceSumInPopup.value = this.balance;
        } else {
            return this.openNewRoute(result.redirect);
        }
        this.showBalancePopup();
    }



    // Работа с балансом
    showBalancePopup() {
        this.balancePopupWindow = document.querySelector('.balance-popup');
        this.balanceSum.addEventListener('click', () => {
            this.balancePopupWindow.style.display = 'flex';
        });
        document.getElementById('balance-btn').addEventListener('click', this.changeBalance.bind(this));
    }

    validateBalance() {
        let result = true;
        this.balanceError = document.querySelector('.balance-popup-error');

        if (this.balanceSumInPopup.value) {
            this.balanceError.style.display = 'none';
        } else {
            this.balanceError.style.display = 'block';
            result = false;
        }
        return result;
    }

   async changeBalance() {
        if (this.validateBalance()) {
            if (+this.balanceSumInPopup.value !== +this.balance) {
                const result = await HttpUtils.request('/balance', 'PUT', true, {
                    newBalance: this.balanceSumInPopup.value
                });

                if (result.response && result.response.balance && !result.error && !result.response.error) {
                    console.log('Баланс успешно обновился');
                    this.balanceSum.innerText = result.response.balance;
                    // Перезаписываем this.balance, для того, чтобы постоянно не отправлялся PUT запрос, даже если баланс не изменялся
                    this.balance = result.response.balance;
                }

                if (result.response && result.error || (result.response && result.response.error)) {
                    console.log('Баланс не получилось обновить, попробуйте позже');
                }
            }

            this.balancePopupWindow.style.display = 'none';
        }
    }

}