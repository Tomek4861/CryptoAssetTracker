import os
from dataclasses import dataclass
from datetime import datetime, timedelta

import requests


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


def get_coin_prices(coin_name: str, currency: str, days: int) -> list:
    url = f"https://api.coingecko.com/api/v3/coins/{coin_name.lower()}/ohlc?vs_currency={currency}&days={days}"
    headers = {"accept": "application/json", "x-cg-demo-api-key": os.getenv("COINGECKO_API_KEY")}
    with requests.session() as s:
        response = s.get(url, headers=headers)
        response.raise_for_status()
        response_json = response.json()

    prices = [Candle.from_json(data).to_dict() for data in response_json]
    return prices


