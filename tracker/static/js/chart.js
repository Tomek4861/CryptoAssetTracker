import { calculateDateRange } from './utils.js';

export function loadChart() {
    const form = document.querySelector("#optionsForm");

    const params = new URLSearchParams(new FormData(form)).toString();
    const chartContainer = document.querySelector("#candlestickChart");

    const whiteColor = '#ffffff';
    const sizeOfFont = '14px';
    const fontFamily = 'Arial, sans-serif';

    fetch(`/api/chart/?${params}`)
        .then(response => response.json())
        .then(data => {
            const [colorUp, colorDown] = form.chart_color.value.split(',');
            const daysRange = calculateDateRange(data);
            const options = {
                chart: {
                    type: 'candlestick',
                },

                plotOptions: {
                        candlestick: {
                          colors: {
                            upward: colorUp,
                            downward: colorDown,
                          }
                        }
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
                            if (daysRange <= 2) {
                                return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            else {
                                return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short'})
                            };
                        },
                        style: {
                            colors: whiteColor,
                            fontSize: sizeOfFont,
                            fontFamily: fontFamily,
                            fontWeight: 400,
                        }
                    }
                },
                yaxis: {
                    tickAmount: 5,
                    tooltip: {
                        enabled: true
                    },
                    labels: {
                        style: {
                            colors: whiteColor,
                            fontSize: sizeOfFont,
                            fontFamily: fontFamily,
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
                        fontFamily: fontFamily,
                    }
                }
            };


            chartContainer.innerHTML = "";
            const chart = new ApexCharts(chartContainer, options);
            chart.render();
        })
        .catch(error => console.error("Error loading chart data:", error));
}
