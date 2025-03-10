import {MainPage} from "./components/main-page.js";
import {LoginPage} from "./components/auth/login-page.js";
import {IncomePage} from "./components/incomes/income-page.js";
import {LogoutPage} from "./components/auth/logout-page.js";
import {SignupPage} from "./components/auth/signup-page.js";
import {AuthUtils} from "./utils/auth-utils.js";
import {HttpUtils} from "./utils/http-utils.js";

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
                    new MainPage();
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

                const userBalance = await HttpUtils.request('/balance');

                if (userBalance && !userBalance.redirect) {
                    document.getElementById('layout-balance-sum').innerText = userBalance.response.balance;
                } else {
                    return this.openNewRoute(userBalance.redirect);
                }
                const userInfo = AuthUtils.getUserInfo(AuthUtils.userInfoKey);

                if (!userInfo.name || !userInfo.lastName) {
                    return;
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
           //  const firstHref = window.location.pathname.split('/')[1]
           // if (link.href.replace(window.location.origin, '') === `/${firstHref}`) {
           //     link.classList.add('active')
           // } else {
           //     link.classList.remove('active')
           // }

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

        let booleanToggleForArrow = true;

        const currentPath = window.location.href.replace(window.location.origin, '');
        if (currentPath.includes('/expenses') || currentPath.includes('/income')) {
            collapseButton.setAttribute('aria-expanded', booleanToggleForArrow);
            collapseDashboard.style.display = 'block';
        }

        collapseButton.addEventListener('click', () => {
            collapseButton.setAttribute('aria-expanded', booleanToggleForArrow);
            if (booleanToggleForArrow) {
                // collapseDashboard.classList.add('show');
                // collapseButton.classList.remove('collapsed');
                collapseDashboard.style.display = 'block';
            } else {
                // collapseDashboard.classList.remove('show');
                // collapseButton.classList.add('collapsed');
                collapseDashboard.style.display = 'none';
            }
            booleanToggleForArrow = !booleanToggleForArrow;
        });
    }

}