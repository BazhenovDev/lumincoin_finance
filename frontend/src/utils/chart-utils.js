export class ChartUtils {

    static labelsCategory = [];
    static datasetsData = [];

    static createConfig(uniqueNames, array, title) {

        if (this.labelsCategory.length > 0) {
            this.labelsCategory.length = 0;
        }
        if (this.datasetsData.length > 0) {
            this.datasetsData.length = 0;
        }

        this.config.options.plugins.title.text = title;
        uniqueNames.forEach(name => {
            this.createData(name, array)
        });
        return this.config;
    }
    // static createIncomeConfig(uniqueNames, array) {
    //
    //     if (this.labelsCategory.length > 0) {
    //         this.labelsCategory.length = 0;
    //     }
    //     if (this.datasetsData.length > 0) {
    //         this.datasetsData.length = 0;
    //     }
    //
    //     this.config.options.plugins.title.text = 'Доходы';
    //     uniqueNames.forEach(name => {
    //         this.createData(name, array)
    //     });
    //     return this.config;
    // }

    static createData(categoriesName, arrayWithData) {
        const result = arrayWithData.filter(item => {
            return item.category === categoriesName
        });
        const sum = result.reduce((acc, item) => {
            return acc += item.amount
        }, 0)
        const data = result.map(item => {
            return {
                category: item.category,
                amount: sum
            }
        });

        this.labelsCategory.push(data[0].category);
        this.datasetsData.push(data[0].amount);
    }


    static config = {
        type: 'pie',
        data: {
            labels: this.labelsCategory,
            datasets: [{
                data: this.datasetsData,
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
                    text: '',
                    color: '#290661',
                    font: {
                        size: 28,
                        family: 'RobotoMedium'
                    }
                },
            },
        },
    };
}




