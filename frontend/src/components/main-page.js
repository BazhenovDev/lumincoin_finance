import {Chart} from "chart.js/auto";
import {HttpUtils} from "../utils/http-utils";
export class MainPage {
    constructor(openNewRoute) {

        this.openNewRoute = openNewRoute;

        this.dateElements = document.getElementById('date-elements');
        this.dateFromElement = document.getElementById('date-from');
        this.dateToElement = document.getElementById('date-to');

        this.links = document.querySelectorAll('.nav-date .nav-link');
        this.incomesChartElement = document.getElementById('incomesChart');
        this.expenseChartElement = document.getElementById('expenseChart');
        this.navigate();
    }

    navigate() {
        this.dateElements.style.display = 'none';

        let dateFrom = sessionStorage.getItem('dateFrom');
        let dateTo = sessionStorage.getItem('dateTo');

        if (dateFrom) {
            this.dateFromElement.value = dateFrom;
        }

        if (dateTo) {
            this.dateToElement.value = dateTo;
        }

        this.dateFromElement.addEventListener('change', () => {
            sessionStorage.setItem('dateFrom', this.dateFromElement.value);
            return this.getDataForChart(`interval&dateFrom=${this.dateFromElement.value}&dateTo=${this.dateToElement.value}`).then();
        });

        this.dateToElement.addEventListener('change', () => {
            sessionStorage.setItem('dateTo', this.dateToElement.value);
            return this.getDataForChart(`interval&dateFrom=${this.dateFromElement.value}&dateTo=${this.dateToElement.value}`).then();
        });

        this.getDataForChart('today').then();
        this.links[0].classList.add('active');
        this.links[0].classList.add('disabled');

        this.links.forEach(activeLink => {
            activeLink.addEventListener('click', () => {
                this.links.forEach(links => {
                    links.classList.remove('active');
                    links.classList.remove('disabled');
                });
                switch (activeLink.id) {
                    case 'today':
                        this.dateElements.style.display = 'none';
                        activeLink.classList.add('disabled');
                        activeLink.classList.add('active');
                        this.getDataForChart('today').then();
                        break;
                    case 'week':
                        this.dateElements.style.display = 'none';
                        activeLink.classList.add('disabled');
                        activeLink.classList.add('active');
                        this.getDataForChart('week').then();
                        break;
                    case 'month':
                        this.dateElements.style.display = 'none';
                        activeLink.classList.add('disabled');
                        activeLink.classList.add('active');
                        this.getDataForChart('month').then();
                        break;
                    case 'all':
                        this.dateElements.style.display = 'none';
                        activeLink.classList.add('disabled');
                        activeLink.classList.add('active');
                        this.getDataForChart('all').then();
                        break;
                    case 'period-interval':
                        activeLink.classList.add('disabled');
                        activeLink.classList.add('active');
                        this.dateElements.style.display = 'block';
                        this.getDataForChart(`interval&dateFrom=${this.dateFromElement.value}&dateTo=${this.dateToElement.value}`).then();
                        break;
                    default:
                        // activeLink.classList.remove('active');
                        break;
                }
            });
        });
    }

    async getDataForChart(period) {
        const result = await HttpUtils.request(`/operations?period=${period}`);

        if (result.response && !result.error) {

            const incomeArray = result.response.filter(item => item.type === 'income');
            const expenseArray = result.response.filter(item => item.type === 'expense');

            if (incomeArray) {
                let chartStatus = Chart.getChart('incomesChart');
                if (chartStatus) {
                    chartStatus.destroy();
                }

                const incomeNames = []
                incomeArray.forEach(item => incomeNames.push(item.category));
                const uniqueNamesIncome = Array.from(new Set(incomeNames));

                const labelsCategoryIncome = [];
                const datasetsDataIncome = [];

                const myFunc = function (name, array) {
                    const res = array.filter(item => {
                        return item.category === name
                    });
                    const sum = res.reduce((acc, item) => {
                        return acc += item.amount
                    }, 0)
                    const result = res.map(item => {
                        return {
                            category: item.category,
                            amount: sum
                        }
                    })
                    labelsCategoryIncome.push(result[0].category)
                    datasetsDataIncome.push(result[0].amount)
                }

                uniqueNamesIncome.forEach(name => {
                    myFunc(name, incomeArray)
                })


                const config = {
                    type: 'pie',
                    data: {
                        labels: labelsCategoryIncome,
                        datasets: [{
                            data: datasetsDataIncome,
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        color: 'black',
                        plugins: {
                            legend: {
                                position: 'top',
                                labels: {
                                    font: {
                                        size: 12,
                                        family: 'RobotoMedium',
                                    },
                                    boxWidth: 35,
                                },
                            },
                            title: {
                                display: true,
                                text: 'Доходы',
                                color: '#290661',
                                font: {
                                    size: 28,
                                    family: 'RobotoMedium'
                                }
                            },
                        },
                    },
                }

                new Chart(this.incomesChartElement, config);
            }

            if (expenseArray) {
                let chartStatus = Chart.getChart('expenseChart');
                if (chartStatus) {
                    chartStatus.destroy();
                }

                const expenseNames = []
                expenseArray.forEach(item => expenseNames.push(item.category));
                const uniqueNamesExpense = Array.from(new Set(expenseNames));

                const labelsCategoryExpense = [];
                const datasetsDataExpense = [];

                const myFunc = function (name, array) {
                    const res = array.filter(item => {
                        return item.category === name;
                    });
                    const sum = res.reduce((acc, item) => {
                        return acc += item.amount;
                    }, 0)
                    const result = res.map(item => {
                        return {
                            category: item.category,
                            amount: sum
                        }
                    })
                    labelsCategoryExpense.push(result[0].category)
                    datasetsDataExpense.push(result[0].amount)
                }

                uniqueNamesExpense.forEach(name => {
                    myFunc(name, expenseArray)
                })

                const config = {
                    type: 'pie',
                    data: {
                        labels: labelsCategoryExpense,
                        datasets: [{
                            data: datasetsDataExpense,
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        color: 'black',
                        plugins: {
                            legend: {
                                position: 'top',
                                labels: {
                                    font: {
                                        size: 12,
                                        family: 'RobotoMedium',
                                    },
                                    boxWidth: 35,
                                },
                            },
                            title: {
                                display: true,
                                text: 'Расходы',
                                color: '#290661',
                                font: {
                                    size: 28,
                                    family: 'RobotoMedium'
                                }
                            },
                        },
                    },
                }

                new Chart(this.expenseChartElement, config);
            }


        } else {
            console.log('Не удалось получить данные по доходам и расходам')
        }
    }

}