document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("#optionsForm");
    form.addEventListener("change", loadChart);
    loadChart();

    const addToWatchlistButton = document.getElementById("addToWatchlist");
    const watchlistContainer = document.querySelector(".watchlist .list-group");
    if (isLoggedIn()) {
        updateWatchlist();
        addToWatchlistButton.addEventListener("click", addToWatchlist);
        setupWatchlistDeleteListener();
    } else {
        addToWatchlistButton.addEventListener("click", redirectToLogin);
    }
//    refreshWatchListInterval(120); // Disabled cause API is trash
});

function isLoggedIn() {
    return document.getElementById("logged-in-user") !== null;
}

function showToast(message, success) {
    const backgroundColor = success ? "#0D6EFD" : "#DC3545";
        Toastify({
        text: message,
        duration: 3000,
        position: "right",
        style: {
            background: backgroundColor,},
        className: "rounded",
        stopOnFocus: true,
        }).showToast();

}

function calculateDateRange(dataArray) {
    const millisInDay = 86400000; // 24 * 60 * 60 * 1000
    const firstDate = new Date(dataArray[0].x);
    const lastDate = new Date(dataArray[dataArray.length - 1].x);
    const diffTime = Math.abs(lastDate - firstDate);
    return diffDays = Math.ceil(diffTime / millisInDay);
}

function loadChart() {
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
            daysRange = calculateDateRange(data);
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


function redirectToLogin() {
    event.preventDefault();
    window.location.href = "/login/";
}

function addToWatchlist(event) {
    event.preventDefault();


    const symbol = document.querySelector("#id_coin").value.toUpperCase();
    const coin_name = document.querySelector("#id_coin option:checked").text;

    fetch("/api/add-to-watchlist/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCSRFToken(),
        },
        body: JSON.stringify({
            name: coin_name,
            symbol: symbol,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                showToast(`Added ${coin_name} ${symbol} to watchlist!`, true);

                updateWatchlist();
            } else if (data.message === "Item already in watchlist") {
                showToast(`${coin_name} ${symbol} is already on your watchlist!`, false);
            }
            else {
                showToast(`Failed to add ${coin_name} ${symbol} to watchlist! (${data.message})`, false);
            }
        })
        .catch((error) => {
            console.error("Error adding to watchlist:", error);
        });
}

function getCSRFToken() {
    return document.querySelector("[name=csrfmiddlewaretoken]").value;
}
function getCurrency() {
    return document.querySelector("#id_currency").value;
}

function updateWatchlist() {
    const watchlistContainer = document.querySelector(".watchlist .list-group");

    fetch("/api/get-watchlist/")
        .then((response) => response.json())

        .then((watchlistData) => {
            const names = watchlistData.map(item => item.name.toLowerCase());
//            console.log("Symbols:", symbols);
            return fetch(`/api/get-prices/?coins[]=${names.join(',')}&currency=${getCurrency()}`)
                .then(response => response.json())
                .then(pricesData => {
                    return { watchlistData, pricesData };
                });
        })
        .then(({ watchlistData, pricesData }) => {
            watchlistContainer.innerHTML = "";

            watchlistData.forEach((item) => {
                const price = pricesData[item.symbol.toLowerCase()];
                const priceDisplay = price ? `$${price.current_price.toFixed(2)}` : 'N/A';
                const changeDisplay = price ? `${price.change_24h.toFixed(2)}%` : 'N/A';

                const listItem = document.createElement("div");
                listItem.classList.add(
                    "list-group-item",
                    "d-flex",
                    "flex-column",
                    "flex-lg-row",
                    "justify-content-between",
                    "align-items-start",
                    "align-items-lg-center",
                    "py-3"
                );
                listItem.innerHTML = `
                    <div class="d-flex justify-content-between align-items-center w-100" >
                        <div onclick="location.href='/?coin=${item.symbol.toUpperCase()}'">
                            <span class="fw-bold">${item.symbol.toUpperCase()}</span>
                        </div>
                        <div>
                             <span class="fw-normal text-${price && price.change_24h >= 0 ? "success" : "danger"} mt-2 mt-md-0">
                                ${priceDisplay} / ${changeDisplay}
                            </span>
                            <button class="btn p-0 border-0 remove-item-btn ms-1" data-symbol="${item.symbol.toUpperCase()}" title="Remove">
                                <i class="bi bi-trash action-icon"></i>
                            </button>
                        </div>
                    </div>
                `;

                watchlistContainer.appendChild(listItem);
            });
        })
        .catch((error) => console.error("Error updating watchlist:", error));
}

function handleRemoveItem(symbol) {
    fetch("/api/delete-from-watchlist/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCSRFToken(),
        },
        body: JSON.stringify({ symbol }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                showToast(`Removed ${symbol} from watchlist!`, true);
                updateWatchlist();
            } else {
                showToast(`Failed to remove ${symbol} from watchlist!`, false);
            }
        })
        .catch((error) => console.error("Error removing item:", error));
}


function handleWatchlistClick(event) {
    const removeButton = event.target.closest(".remove-item-btn");
    if (removeButton) {
        const symbol = removeButton.dataset.symbol;
        if (symbol) {
            handleRemoveItem(symbol);
        }
    }
}

function refreshWatchListInterval(seconds) {
    setInterval(() => {
        console.log("Refreshing watchlist...");
        updateWatchlist();
    }, seconds * 1000);
}
function setupWatchlistDeleteListener() {
    const watchlistContainer = document.querySelector(".watchlist .list-group");
    watchlistContainer.addEventListener("click", handleWatchlistClick);

}


//TODO: mobile view
//TODO: code cleanup


