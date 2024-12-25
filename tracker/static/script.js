document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("optionsForm");
    const chartContainer = document.querySelector("#candlestickChart");
    console.log("Script loaded");
    console.log("Form:", form);
    console.log("Chart container:", chartContainer);


    function loadChart() {
        const params = new URLSearchParams(new FormData(form)).toString();

        fetch(`/api/chart/?${params}`)
            .then(response => response.json())
            .then(data => {
                const options = {
                    chart: {
                        type: form.chart_type.value || 'candlestick',
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
                                return date.toLocaleTimeString('en-US', {day: 'numeric', month: 'short', hour: '2-digit', });
                            },
                            style: {
                                colors: '#ffffff',
                                fontSize: '14px',
                                fontFamily: 'Arial, sans-serif',
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


                chartContainer.innerHTML = "";
                const chart = new ApexCharts(chartContainer, options);
                chart.render();
            })
            .catch(error => console.error("Error loading chart data:", error));
    }


    loadChart();


    form.addEventListener("change", loadChart);
});
