export function isLoggedIn() {
    return document.getElementById("logged-in-user") !== null;
}

export function showToast(message, success) {
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

export function calculateDateRange(dataArray) {
    const millisInDay = 86400000; // 24 * 60 * 60 * 1000
    const firstDate = new Date(dataArray[0].x);
    const lastDate = new Date(dataArray[dataArray.length - 1].x);
    const diffTime = Math.abs(lastDate - firstDate);
    return Math.ceil(diffTime / millisInDay);
}

export function redirectToLogin(event) {
    if (event) event.preventDefault();
    window.location.href = "/login/";
}

export function getCSRFToken() {
    return document.querySelector("[name=csrfmiddlewaretoken]").value;
}

export function calculatePortfolioChangePercent(totalPortValue, totalPortChange) {
    return totalPortValue === 0 ? 0 : (totalPortChange / totalPortValue) * 100;
}

export function getCurrency() {
    const currencyElement = document.querySelector("#id_currency");
    return currencyElement ? currencyElement.value : "usd";
}
