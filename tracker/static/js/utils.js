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

export function priceFormatter(value) {
    const absoluteValue = Math.abs(value);

    const sign = Math.sign(value) === -1 ? "-" : "";


    let minFracDig = 0;
    let maxFracDig = 2;

    let strValue = absoluteValue.toString();

    if (strValue.includes("e")){
        strValue = Number(value).toFixed(8);
    }

    if (strValue.includes(".")) {
        const decimalPart = strValue.split(".")[1];
        const firstNonZeroIndex = decimalPart.search(/[1-9]/);

        if (firstNonZeroIndex >= 4){

            return `<${sign}0.0001`;
       }

        if (absoluteValue < 1) {
            minFracDig = 2;
            maxFracDig = 4;
        }
        else if (absoluteValue >= 1000){
            minFracDig = 1;
            maxFracDig = 1;
        }
        else {
            minFracDig = 2;
            maxFracDig = 2;
        }
    } else {
        minFracDig = 0;
        maxFracDig = 0;
    }

    return value.toLocaleString('en-US', {
        minimumFractionDigits: minFracDig,
        maximumFractionDigits: maxFracDig,
    });
}
