import os
from dataclasses import dataclass
from datetime import datetime

import requests


CACHE_TIMEOUT = 60 * 5

COINS = {
    "BTC": "Bitcoin",
    "ETH": "Ethereum",
    "SOL": "Solana",
    "ADA": "Cardano",
    "XRP": "Ripple",
    "DOGE": "Dogecoin",
    "DOT": "Polkadot",
    "LTC": "Litecoin",
    "UNI": "Uniswap",
    "LINK": "Chainlink",

}

CURRENCIES = (
    "USD",
    "EUR",
    "GBP",
    "PLN",
)

TIMEFRAMES = (
    "1d",
    "1w",
    "1m",
    "6m",
    "1y",
)



CHART_COLORS = {
    "Green Red": ["#089981", "#f23645"],
    "Blue Purple": ["#0083c6", "#673ab7"],
    "Orange Teal": ["#3C90EB", "#DF7D46"],
    "Only White": ["#ffffff", "#ffffff"],
}


DEFAULT_COIN_DATA = dict(coin="Bitcoin", currency="USD", timeframe="1w", chart_color="Green Red")


def inverse_dict(d: dict) -> dict:
    return {v: k for k, v in d.items()}


@dataclass(frozen=True)
class Candle:
    timestamp: datetime
    open: float
    high: float
    low: float
    close: float

    @classmethod
    def from_json(cls, data: dict) -> "Candle":
        return cls(
            timestamp=datetime.fromtimestamp(data[0] / 1000),
            open=data[1],
            high=data[2],
            low=data[3],
            close=data[4],
        )

    def to_dict(self) -> dict:
        return {"x": self.timestamp, "y": [self.open, self.high, self.low, self.close]}


def convert_to_days(value):
    time_mapping = {
        "d": 1,
        "w": 7,
        "m": 30,
        "y": 365
    }

    number = int(value[:-1])
    unit = value[-1].lower()

    if unit in time_mapping:
        return number * time_mapping[unit]
    else:
        raise ValueError()


def get_coin_historical_prices(coin_name: str, currency: str, days: int) -> list:
    if coin_name.upper() in COINS:  # check if coin is symbol instead of name
        coin_name = COINS[coin_name.upper()]
    url = f"https://api.coingecko.com/api/v3/coins/{coin_name.lower()}/ohlc?vs_currency={currency}&days={days}"
    headers = {"accept": "application/json", "x-cg-demo-api-key": os.getenv("COINGECKO_API_KEY")}
    with requests.session() as s:
        response = s.get(url, headers=headers)
        response.raise_for_status()
        response_json = response.json()

    prices = [Candle.from_json(data).to_dict() for data in response_json]
    return prices


def get_coins_current_price(coins: list[str], currency: str) -> dict:
    url = f"https://api.coingecko.com/api/v3/coins/markets?vs_currency={currency}&ids={','.join(coins)}&price_change_percentage=24h"
    headers = {"accept": "application/json", "x-cg-demo-api-key": os.getenv("COINGECKO_API_KEY")}
    with requests.session() as s:
        response = s.get(url, headers=headers)
        response.raise_for_status()
    response_json = response.json()
    # lub name .lower() w dict jako key
    return {coin["symbol"]: dict(current_price=coin['current_price'], change_24h=coin['price_change_percentage_24h'])
            for coin in response_json}
