const data = [
    { x: new Date(2023, 11, 1, 12, 0), y: [100.0, 103.93, 96.54, 98.77] },
    { x: new Date(2023, 11, 1, 13, 0), y: [98.77, 102.69, 89.52, 95.61] },
    { x: new Date(2023, 11, 1, 14, 0), y: [95.61, 102.17, 88.41, 98.99] },
    { x: new Date(2023, 11, 1, 15, 0), y: [98.99, 108.21, 91.53, 103.09] },
    { x: new Date(2023, 11, 1, 16, 0), y: [103.09, 105.68, 94.17, 103.5] },
    { x: new Date(2023, 11, 1, 17, 0), y: [103.5, 112.71, 99.39, 110.33] },
    { x: new Date(2023, 11, 1, 18, 0), y: [110.33, 117.88, 101.52, 109.73] },
    { x: new Date(2023, 11, 1, 19, 0), y: [109.73, 118.49, 102.34, 102.81] },
    { x: new Date(2023, 11, 1, 20, 0), y: [102.81, 106.07, 100.67, 105.81] },
    { x: new Date(2023, 11, 1, 21, 0), y: [105.81, 113.18, 101.88, 109.78] },
    { x: new Date(2023, 11, 1, 22, 0), y: [109.78, 113.9, 100.16, 105.25] },
    { x: new Date(2023, 11, 1, 23, 0), y: [105.25, 107.89, 100.51, 102.23] },
    { x: new Date(2023, 11, 2, 0, 0), y: [102.23, 104.62, 99.64, 100.58] },
    { x: new Date(2023, 11, 2, 1, 0), y: [100.58, 105.02, 97.56, 104.19] },
    { x: new Date(2023, 11, 2, 2, 0), y: [104.19, 108.93, 94.21, 102.19] },
    { x: new Date(2023, 11, 2, 3, 0), y: [102.19, 112.12, 98.92, 99.11] },
    { x: new Date(2023, 11, 2, 4, 0), y: [99.11, 107.89, 94.08, 97.83] },
    { x: new Date(2023, 11, 2, 5, 0), y: [97.83, 103.94, 93.85, 96.13] },
    { x: new Date(2023, 11, 2, 6, 0), y: [96.13, 98.49, 93.22, 97.91] },
    { x: new Date(2023, 11, 2, 7, 0), y: [97.91, 105.45, 92.95, 100.87] },
    { x: new Date(2023, 11, 2, 8, 0), y: [100.87, 103.18, 90.89, 91.29] },
    { x: new Date(2023, 11, 2, 9, 0), y: [91.29, 96.53, 85.09, 90.82] },
    { x: new Date(2023, 11, 2, 10, 0), y: [90.82, 97.88, 86.55, 95.74] },
    { x: new Date(2023, 11, 2, 11, 0), y: [95.74, 101.5, 93.71, 97.22] },
    { x: new Date(2023, 11, 2, 12, 0), y: [97.22, 103.64, 88.93, 93.87] },
    { x: new Date(2023, 11, 2, 13, 0), y: [93.87, 96.69, 86.11, 94.53] },
    { x: new Date(2023, 11, 2, 14, 0), y: [94.53, 103.71, 91.68, 102.83] },
    { x: new Date(2023, 11, 2, 15, 0), y: [102.83, 107.63, 95.54, 96.97] },
    { x: new Date(2023, 11, 2, 16, 0), y: [96.97, 106.57, 91.22, 98.66] },
    { x: new Date(2023, 11, 2, 17, 0), y: [98.66, 105.81, 90.37, 95.74] },
    { x: new Date(2023, 11, 1, 12, 0), y: [100.0, 103.93, 96.54, 98.77] },
    { x: new Date(2023, 11, 1, 13, 0), y: [98.77, 102.69, 89.52, 95.61] },
    { x: new Date(2023, 11, 1, 14, 0), y: [95.61, 102.17, 88.41, 98.99] },
    { x: new Date(2023, 11, 1, 15, 0), y: [98.99, 108.21, 91.53, 103.09] },
    { x: new Date(2023, 11, 1, 16, 0), y: [103.09, 105.68, 94.17, 103.5] },
    { x: new Date(2023, 11, 1, 17, 0), y: [103.5, 112.71, 99.39, 110.33] },
    { x: new Date(2023, 11, 1, 18, 0), y: [110.33, 117.88, 101.52, 109.73] },
    { x: new Date(2023, 11, 1, 19, 0), y: [109.73, 118.49, 102.34, 102.81] },
    { x: new Date(2023, 11, 1, 20, 0), y: [102.81, 106.07, 100.67, 105.81] },
    { x: new Date(2023, 11, 1, 21, 0), y: [105.81, 113.18, 101.88, 109.78] },
    { x: new Date(2023, 11, 1, 22, 0), y: [109.78, 113.9, 100.16, 105.25] },
    { x: new Date(2023, 11, 1, 23, 0), y: [105.25, 107.89, 100.51, 102.23] },
    { x: new Date(2023, 11, 2, 0, 0), y: [102.23, 104.62, 99.64, 100.58] },
    { x: new Date(2023, 11, 2, 1, 0), y: [100.58, 105.02, 97.56, 104.19] },
    { x: new Date(2023, 11, 2, 2, 0), y: [104.19, 108.93, 94.21, 102.19] },
    { x: new Date(2023, 11, 2, 3, 0), y: [102.19, 112.12, 98.92, 99.11] },
    { x: new Date(2023, 11, 2, 4, 0), y: [99.11, 107.89, 94.08, 97.83] },
    { x: new Date(2023, 11, 2, 5, 0), y: [97.83, 103.94, 93.85, 96.13] },
    { x: new Date(2023, 11, 2, 6, 0), y: [96.13, 98.49, 93.22, 97.91] },
    { x: new Date(2023, 11, 2, 7, 0), y: [97.91, 105.45, 92.95, 100.87] },
    { x: new Date(2023, 11, 2, 8, 0), y: [100.87, 103.18, 90.89, 91.29] },
    { x: new Date(2023, 11, 2, 9, 0), y: [91.29, 96.53, 85.09, 90.82] },
    { x: new Date(2023, 11, 2, 10, 0), y: [90.82, 97.88, 86.55, 95.74] },
    { x: new Date(2023, 11, 2, 11, 0), y: [95.74, 101.5, 93.71, 97.22] },
    { x: new Date(2023, 11, 2, 12, 0), y: [97.22, 103.64, 88.93, 93.87] },
    { x: new Date(2023, 11, 2, 13, 0), y: [93.87, 96.69, 86.11, 94.53] },
    { x: new Date(2023, 11, 2, 14, 0), y: [94.53, 103.71, 91.68, 102.83] },
    { x: new Date(2023, 11, 2, 15, 0), y: [102.83, 107.63, 95.54, 96.97] },
    { x: new Date(2023, 11, 2, 16, 0), y: [96.97, 106.57, 91.22, 98.66] },
    { x: new Date(2023, 11, 2, 17, 0), y: [98.66, 105.81, 90.37, 95.74] },

];

document.addEventListener("DOMContentLoaded", function () {
    const options = {
        chart: {
            type: 'candlestick',
        },


        series: [{
            data: data,
        }],

        xaxis: {
            type: 'datetime',
            tickAmount: 5,

            labels: {

                formatter: function (value, timestamp) {
                    const date = new Date(timestamp);
                    return date.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'});
                },
                style: {
                    colors: '#ffffff',
                    fontSize: '14px',
                    fontFamily: 'Arial, sans-serif',
                    fontWeight: 400,
                }
            },

        },
        yaxis: {
            tickAmount: 5,
            tooltip: {
                enabled: true
            },
            labels: {
                style: {
                    colors: '#ffffff',
                    fontSize: '14px',
                    fontFamily: 'Arial, sans-serif',
                    fontWeight: 400,
                }
            }

        },
        grid: {
            xaxis: {
                lines: {
                    show: false
                }
            }
        },
        tooltip: {
            theme: 'dark',
            style: {
                fontSize: '12px',
                fontFamily: 'Arial, sans-serif'
            }
        }


    };


    const chart = new ApexCharts(document.querySelector("#candlestickChart"), options);
    chart.render();
});


