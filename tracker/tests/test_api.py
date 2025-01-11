import datetime

from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from django.core.cache import cache
from tracker.utils import COINS, DEFAULT_COIN_DATA, CACHE_TIMEOUT


class TestAPICoinList(APITestCase):
    def test_coin_list_returns_correct_data(self):
        response = self.client.get('/api/coins/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("coins", response.data)
        self.assertEqual(response.data["coins"], COINS)


class ChartDataAPITestCase(APITestCase):
    def setUp(self):
        self.coin = "BTC"
        self.currency = "USD"
        self.timeframe = "7d"
        self.cache_key = f"{self.coin}_{self.currency}_{self.timeframe}"
        self.mock_data = [{"x": datetime.datetime.now(), "y": [10000, 12000, 8000, 11000]}]

    def test_chart_data_cache_hit(self):
        cache.set(self.cache_key, self.mock_data, CACHE_TIMEOUT)
        response = self.client.get('/api/chart/', {
            "coin": self.coin,
            "currency": self.currency,
            "timeframe": self.timeframe
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, self.mock_data)


class MultipleCoinsPriceAPITestCase(APITestCase):
    def setUp(self):
        self.coins = ["BTC", "ETH"]
        self.coins_names = [COINS[coin] for coin in self.coins]
        self.currency = "USD"
        self.cache_key = f"{self.currency}_{'_'.join(self.coins)}_{self.currency}"
        self.mock_prices = {
            "btc": {"current_price": 20000, "change_24h": 2},
            "eth": {"current_price": 1500, "change_24h": 1.5}
        }

    def test_multiple_coins_price_no_coins(self):
        response = self.client.get('/api/get-prices/', {})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)
        self.assertEqual(response.data["error"], "No coins provided")

    def test_multiple_coins_price_real_data(self):
        cache.delete(self.cache_key)
        response = self.client.get(f'/api/get-prices/?coins[]={",".join(self.coins_names)}&currency={self.currency}')

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertIn("btc", response.data)
        self.assertIn("eth", response.data)

        self.assertIsInstance(response.data["btc"]["current_price"], (float, int))
        self.assertIsInstance(response.data["eth"]["change_24h"], (float, int))
