import { loadChart } from "./chart.js";
import { isLoggedIn, getCSRFToken, redirectToLogin, getCurrency, showToast  } from "./utils.js";


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
                const listItemDiv = document.createElement("div");

                listItemDiv.classList.add("d-flex", "justify-content-between", "align-items-center", "w-100");
                const listItemSymbol = document.createElement("div");
                listItemSymbol.onclick = function () { location.href = "/?coin=" + item.symbol.toUpperCase(); };
                const symbolText = document.createElement("span");
                symbolText.classList.add("fw-bold");
                symbolText.textContent = item.symbol.toUpperCase();
                listItemSymbol.appendChild(symbolText);

                listItemDiv.appendChild(listItemSymbol);

                const listItemPrice = document.createElement("div");
                const priceText = document.createElement("span");
                priceText.classList.add(
                     "fw-normal",
                    "text-" + (price && price.change_24h >= 0 ? "success" : "danger"),
                    "mt-2",
                    "mt-md-0"
                    );
                priceText.textContent = `${priceDisplay} / ${changeDisplay}`;
                listItemPrice.appendChild(priceText);

                const removeButton = document.createElement("button");

                removeButton.classList.add("btn", "p-0", "border-0", "remove-item-btn", "ms-1");
                removeButton.dataset.symbol = item.symbol.toUpperCase();
                removeButton.title = "Remove from watchlist";
                const removeIcon = document.createElement("i");

                removeIcon.classList.add("bi", "bi-trash", );
                removeButton.appendChild(removeIcon);


                listItemDiv.appendChild(listItemPrice);



                listItem.appendChild(listItemDiv);


                listItem.appendChild(removeButton);



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


