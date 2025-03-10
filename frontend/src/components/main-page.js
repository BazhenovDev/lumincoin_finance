import {Chart} from "chart.js/auto";
import {HttpUtils} from "../utils/http-utils";

export class MainPage {
    constructor() {
        this.incomesChart();
        this.expenseChart();
    }

    incomesChart() {
        const incomesChartElement = document.getElementById('incomesChart');

        new Chart(incomesChartElement, {
            type: 'pie',
            data: {
                labels: ['Blue', 'Pink', 'Orange', 'Yellow', 'Green'],
                datasets: [{
                    data: [12, 19, 3, 5, 2],
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
        });
    }

    expenseChart() {
        const expenseChartElement = document.getElementById('expenseChart');

        new Chart(expenseChartElement, {
            type: 'pie',
            data: {
                labels: ['Blue', 'Pink', 'Orange', 'Yellow', 'Green'],
                datasets: [{
                    data: [12, 19, 3, 5, 2],
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
        });
    }


}