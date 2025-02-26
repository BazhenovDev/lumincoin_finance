import {MainPage} from "./components/main-page.js";
import {LoginPage} from "./components/auth/login-page.js";
import {IncomePage} from "./components/incomes/income-page.js";
import {LogoutPage} from "./components/auth/logout-page.js";
import {SignupPage} from "./components/auth/signup-page.js";

export class Router {
    constructor() {
        this.activateRoute();
        this.contentPageElement = document.getElementById('content');
        this.titlePageElement = document.getElementById('title');

        this.route = [
            {
                title: 'Главная страница',
                route: '/',
                filePathTemplate: '/templates/pages/main.html',
                layout: '/templates/layout.html',
                load: () => {
                    new MainPage();
                },
            },
            {
                title: 'Такой страницы нет',
                route: '/404',
                filePathTemplate: '/templates/pages/404.html',
                load: () => {
                },
            },
            {
                title: 'Страница авторизации',
                route: '/login',
                filePathTemplate: '/templates/pages/auth/login.html',
                layout: '',
                load: () => {
                    new LoginPage();
                },
            },
            {
                title: 'Страница регистрации',
                route: '/signup',
                filePathTemplate: '/templates/pages/auth/signup.html',
                layout: '',
                load: () => {
                    new SignupPage();
                },
            },
            {
                route: '/logout',
                load: () => {
                    new LogoutPage();
                },
            },
            {
                title: 'Страница доходов',
                route: '/income',
                filePathTemplate: '/templates/pages/incomes/income.html',
                layout: '/templates/layout.html',
                load: () => {
                    new IncomePage();
                },
            },
            {
                title: 'Создание категории доходов',
                route: '/income/create',
                filePathTemplate: '/templates/pages/incomes/income-create.html',
                layout: '/templates/layout.html',
                load: () => {

                },
            },
            {
                title: 'Редактирование категории доходов',
                route: '/income/edit',
                filePathTemplate: '/templates/pages/incomes/income-edit.html',
                layout: '/templates/layout.html',
                load: () => {

                },
            },
            {
                title: 'Расходы',
                route: '/expenses',
                filePathTemplate: '/templates/pages/expenses/expenses.html',
                layout: '/templates/layout.html',
                load: () => {

                },
            },
            {
                title: 'Создание категории расхода',
                route: '/expenses/create',
                filePathTemplate: '/templates/pages/expenses/expenses-create.html',
                layout: '/templates/layout.html',
                load: () => {

                },
            },
            {
                title: 'Редактирование категории расхода',
                route: '/expenses/edit',
                filePathTemplate: '/templates/pages/expenses/expenses-edit.html',
                layout: '/templates/layout.html',
                load: () => {

                },
            },
            {
                title: 'Доходы и расходы',
                route: '/operations',
                filePathTemplate: '/templates/pages/operations/operations.html',
                layout: '/templates/layout.html',
                load: () => {

                },
            },
            {
                title: 'Создание дохода/расхода',
                route: '/operations/create',
                filePathTemplate: '/templates/pages/operations/operations-create.html',
                layout: '/templates/layout.html',
                load: () => {

                },
            },
            {
                title: 'Редактирование дохода/расхода',
                route: '/operations/edit',
                filePathTemplate: '/templates/pages/operations/operations-edit.html',
                layout: '/templates/layout.html',
                load: () => {

                },
            },
        ];
    }

    activateRoute() {
        window.addEventListener('DOMContentLoaded', this.openRouter.bind(this));
        window.addEventListener('popstate', this.openRouter.bind(this));
    }

    async openRouter() {
        const urlRoute = window.location.pathname;
        const currentRoute = this.route.find(item => {
            return item.route === urlRoute;
        });
        if (currentRoute) {
            this.titlePageElement.innerText = `${currentRoute.title} | Lumincoin Finance`

            if (currentRoute.layout) {
                this.contentPageElement.innerHTML = await fetch(currentRoute.layout).then(response => response.text());
                let contentElement = document.getElementById('content-wrapper');
                contentElement.innerHTML = await fetch(currentRoute.filePathTemplate).then(response => response.text());
                this.layoutElement = document.getElementById('layout-wrapper');
                this.burgerElement = document.getElementById('burger');
                this.burgerElement.addEventListener('click', () => {
                    this.burgerElement.classList.toggle('active');
                    this.layoutElement.classList.toggle('show');
                });
            } else {
                this.contentPageElement.innerHTML = await fetch(currentRoute.filePathTemplate).then(response => response.text());
            }

        } else {
            window.location.href = '/404';
        }
        currentRoute.load();
    }

}