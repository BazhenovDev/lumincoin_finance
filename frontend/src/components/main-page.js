import {Chart} from "chart.js/auto";

export class MainPage {
    constructor() {
        this.incomesChart();
        this.expenseChart();
    }

    incomesChart() {
        const incomesChartElement = document.getElementById('incomesChart');
        // incomesChartElement.parentNode.style.height = '467px';
        // incomesChartElement.parentNode.style.width = '437px';

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
                // responsive: true,
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
                            padding: 15
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
                // layout: {
                //     padding: {
                //         left: -10,
                //         right: -10
                //     }
                // }
            },
        });
    }

    expenseChart() {
        const expenseChartElement = document.getElementById('expenseChart');
        // expenseChartElement.parentNode.style.height = '467px';
        // expenseChartElement.parentNode.style.width = '437px';

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
                // responsive: true,
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
                            padding: 15
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
                // layout: {
                    // padding: {
                    //     left: -10,
                    //     right: -10
                    // }
                // }
            },
        });
    }
}