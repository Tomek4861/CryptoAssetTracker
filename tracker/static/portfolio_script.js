document.addEventListener("DOMContentLoaded", function () {
    const addCoinButton = document.getElementById("add-coin-btn");
    updatePortfolio();
    addCoinButton.addEventListener("click", addToPortfolio);
    const portfolioRowsContainer = document.getElementById("portfolio-rows");
    portfolioRowsContainer.addEventListener("click", handleWatchlistClick);
});

function showToast(message, success) {
    const backgroundColor = success ? "#0D6EFD" : "#DC3545";
    Toastify({
        text: message,
        duration: 3000,
        position: "right",
        style: {
            background: backgroundColor,
        },
        className: "rounded",
        stopOnFocus: true,
    }).showToast();

}


function addToPortfolio(event) {
    event.preventDefault();

    const symbol = document.querySelector("#id_coin").value.toUpperCase();
    const coin_name = document.querySelector("#id_coin option:checked").text;
    const amount = parseFloat(document.querySelector("#amount").value);


    fetch("/api/add-to-portfolio/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCSRFToken(),
        },
        body: JSON.stringify({
            name: coin_name,
            symbol: symbol,
            amount: amount,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                showToast(`Added ${amount} ${coin_name} ${symbol} to portfolio!`, true);

                updatePortfolio();
            } else if (data.message === "Item already in portfolio") {
                showToast(`${coin_name} ${symbol} is already in your portfolio!`, false);
            }
            else {
                showToast(`Failed to add ${coin_name} ${symbol} your portfolio! (${data.message})`, false);
            }
        })
        .catch((error) => {
            console.error("Error adding to portfolio:", error);
        });
}

function updatePortfolio() {
    const portfolioRowsContainer = document.getElementById("portfolio-rows");
    let totalPortfolioValue = 0;
    let totalPortfolioChange = 0;
    const currency = "usd";
    fetch("/api/get-portfolio/")
        .then((response) => response.json())

        .then((portfolioData) => {
            const names = portfolioData.map(item => item.name.toLowerCase());
            return fetch(`/api/get-prices/?coins[]=${names.join(',')}&currency=${currency}`)
                .then(response => response.json())
                .then(pricesData => {
                    return { portfolioData, pricesData };
                });
        })
        .then(({ portfolioData, pricesData }) => {
            portfolioRowsContainer.innerHTML = "";

            portfolioData.forEach((item, index) => {
                const priceDict = pricesData[item.symbol.toLowerCase()];
                const totalCoinValue = item.amount * priceDict.current_price;
                totalPortfolioValue += totalCoinValue;
                const changePrice = totalCoinValue * priceDict.change_24h / 100;
                totalPortfolioChange += changePrice;
                const changePercent = priceDict.change_24h;
                const amount = item.amount;
                const priceDisplay = priceDict ? `$${priceDict.current_price.toFixed(2)}` : 'N/A';
                const changeDisplay = priceDict ? `${priceDict.change_24h.toFixed(2)}%` : 'N/A';

                const listItem = document.createElement("div");
                listItem.classList.add(
                    "row",
                    "table-row",
                    "py-2"
                );
                listItem.innerHTML = `
                                    <div class="col-1">${index + 1}</div>
                                    <div class="col-2">${item.symbol.toUpperCase()}</div>
                                    <div class="col-2  d-flex align-items-center">
                                        ${item.amount.toFixed(2)}
                                    </div>
                                    <div class="col-2">$${totalCoinValue.toFixed(2)}</div>
                                    <div class="col-3 text- text-${priceDict && priceDict.change_24h >= 0 ? "success" : "danger"}">${changePrice.toFixed(2)} $ / ${changePercent.toFixed(2)}%</div>
                                    <div class="col-2 text-center d-flex align-items-center justify-content-center portfolio-action-buttons">
                                        <button class="btn p-0 border-0 ms-1" title="Edit">
                                            <i class="bi bi-pencil mx-0 my-0 action-icon"></i>
                                        </button>
                                        <button class="btn p-0 border-0 ms-1" title="GoToChart" onclick="location.href='/?coin=${item.symbol.toUpperCase()}'">
                                            <i class="bi bi-graph-up mx-2 action-icon" ></i>
                                        </button>
                                        <button class="btn p-0 border-0 remove-item-btn ms-1" data-symbol="${item.symbol.toUpperCase()}" title="Remove">
                                                <i class="bi bi-trash mx-0 my-0 action-icon"></i>
                                        </button>
                                    </div>
                                `;
                portfolioRowsContainer.append(listItem)

            });
            const portfolioValueBanner = document.getElementById("portfolio-value");
            const portfolioChangeValue = document.getElementById("portfolio-change-value");
            const portfolioChangePercent = document.getElementById("portfolio-change-percent");

            portfolioValueBanner.textContent = `${totalPortfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}$`;
            portfolioValueBanner.className = `text-glow fw-bold ${totalPortfolioChange >= 0 ? "glow-green" : "glow-red"
                }`;
            portfolioChangeValue.textContent = `${totalPortfolioChange.toFixed(2)} $`;
            portfolioChangePercent.textContent = ` / ${calculatePortfolioChangePercent(
                totalPortfolioValue,
                totalPortfolioChange
            ).toFixed(2)}%`;

            portfolioChangeValue.className = totalPortfolioChange >= 0 ? "fancy-green" : "fancy-red";
            portfolioChangePercent.className = totalPortfolioChange >= 0 ? "fancy-green" : "fancy-red";





        })
        .catch((error) => console.error("Error updating portfolio:", error));
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


function handleRemoveItem(symbol) {
    fetch("/api/delete-from-portfolio/", {
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
                showToast(`Removed ${symbol} from your portfolio!`, true);
                updatePortfolio();
            } else {
                showToast(`Failed to remove ${symbol} your portfolio!`, false);
            }
        })
        .catch((error) => console.error("Error removing portfolio item:", error));
}


function getCSRFToken() {
    return document.querySelector("[name=csrfmiddlewaretoken]").value;
}
function calculatePortfolioChangePercent(totalPortValue, totalPortChange) {
    return totalPortValue === 0 ? 0 : (totalPortChange / totalPortValue) * 100;
}

