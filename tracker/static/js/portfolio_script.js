import { getCSRFToken, showToast, calculatePortfolioChangePercent } from "./utils.js";


document.addEventListener("DOMContentLoaded", function () {
    const addCoinButton = document.getElementById("add-coin-btn");
    updatePortfolio();
    addCoinButton.addEventListener("click", addToPortfolio);
    const portfolioRowsContainer = document.getElementById("portfolio-rows");
    portfolioRowsContainer.addEventListener("click", handlePortfolioClick);
});


function addToPortfolio(event) {
    event.preventDefault();

    const symbol = document.querySelector("#id_coin").value.toUpperCase();
    const coin_name = document.querySelector("#id_coin option:checked").text;
    const amount = parseFloat(document.querySelector("#amount").value);

    if (!symbol || !amount || isNaN(amount) || amount <= 0) {
        showToast("Invalid input. Please enter a valid coin and amount.", false);
        return;
    }


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
                const indexColumn = document.createElement("div");
                indexColumn.classList.add("col-1");
                indexColumn.textContent = index + 1;
                listItem.append(indexColumn);

                const symbolColumn = document.createElement("div");
                symbolColumn.classList.add('col-2');
                symbolColumn.textContent = item.symbol.toUpperCase();
                listItem.append(symbolColumn);

                const amountColumn = document.createElement("div");
                amountColumn.classList.add("col-2", "d-flex", "align-items-center");
                amountColumn.textContent = item.amount.toFixed(2);
                amountColumn.dataset.exactValue = item.amount;
                listItem.append(amountColumn);

                const totalValueColumn = document.createElement("div");
                totalValueColumn.classList.add("col-2");
                totalValueColumn.textContent = `$${totalCoinValue.toFixed(2)}`;
                listItem.append(totalValueColumn);


                const priceChangeColumn = document.createElement("div");
                priceChangeColumn.classList.add(
                "col-3",
                `text-${priceDict && priceDict.change_24h >= 0 ? "success" : "danger"}`
                )
                priceChangeColumn.textContent = `${changePrice.toFixed(2)} $ / ${changePercent.toFixed(2)}%`;
                listItem.append(priceChangeColumn);

                const actionColumn = document.createElement("div");
                actionColumn.classList.add(
                "col-2",
                "text-center",
                "d-flex",
                "align-items-center",
                "justify-content-center",
                "portfolio-action-buttons"
                )
                const editButton = document.createElement("button");
                editButton.classList.add("btn", "p-0", "border-0", "ms-1");
                editButton.title = "Edit";

                const editIcon = document.createElement("i");
                editIcon.classList.add("bi", "bi-pencil", "mx-0", "my-0", "action-icon");
                editButton.append(editIcon);

                editButton.addEventListener("click", function () {
                    makeAmountEditable(amountColumn, item.symbol);
                });


                actionColumn.append(editButton);

                const goToChartButton = document.createElement("button");
                goToChartButton.classList.add("btn", "p-0", "border-0", "ms-1");
                goToChartButton.title = "GoToChart";
                goToChartButton.onclick = function() { location.href='/?coin=${item.symbol.toUpperCase()}' };

                const goToChartIcon = document.createElement("i");
                goToChartIcon.classList.add("bi", "bi-graph-up", "mx-2", "action-icon");
                goToChartButton.append(goToChartIcon);
                actionColumn.append(goToChartButton);

                const removeButton = document.createElement("button");
                removeButton.classList.add("btn", "p-0", "border-0", "remove-item-btn", "ms-1");
                removeButton.dataset.symbol = item.symbol.toUpperCase();
                removeButton.title = "Remove";
                const removeIcon = document.createElement("i");

                removeIcon.classList.add("bi", "bi-trash", "mx-0", "my-0", "action-icon");

                removeButton.append(removeIcon);
                actionColumn.append(removeButton);
                listItem.append(actionColumn);

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
function makeAmountEditable(amountColumn, symbol) {
    const currentValue = parseFloat(amountColumn.dataset.exactValue);



    const input = document.createElement("input");
    input.type = "number";
    input.step = "0.00000001";
    input.value = currentValue

    input.classList.add("form-control", "form-control-sm");
    amountColumn.textContent = "";
    amountColumn.appendChild(input);

    input.focus();
    let changeTriggered = false; // Avoid multiple trigger on Enter


    input.addEventListener("blur", function () {
        if (!changeTriggered) {
            changeTriggered = true;
            saveNewAmount(input.value, symbol, amountColumn);

        }
    });

    input.addEventListener("keypress", function (event) {
        if (event.key === "Enter" && !changeTriggered) {
            changeTriggered = true;
            saveNewAmount(input.value, symbol, amountColumn);
        }
    });
}

function saveNewAmount(newAmount, symbol, amountColumn) {
    const parsedAmount = parseFloat(newAmount);
    if (isNaN(parsedAmount) || parsedAmount < 0) {
        showToast("Invalid amount. Please enter a valid number.", false);
        updatePortfolio(); // Its needed to rebuild the columns with old value
        return;
    }

    fetch("/api/update-asset-portfolio/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCSRFToken(),
        },
        body: JSON.stringify({
            symbol: symbol,
            amount: parsedAmount,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                showToast(`Updated amount for ${symbol} to ${parsedAmount.toFixed(2)}!`, true);
                updatePortfolio();
            } else {
                showToast(`Failed to update amount for ${symbol}.`, false);
                updatePortfolio();
            }
        })
        .catch((error) => {
            console.error("Error updating amount:", error);
            showToast(`Failed to update amount of ${symbol}! (${data.message})`, false);
            updatePortfolio();
        });
}


function handlePortfolioClick(event) {
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




