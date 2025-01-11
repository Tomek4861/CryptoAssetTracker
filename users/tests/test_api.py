from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth.models import User
from users.models import WatchListItem, PortfolioItem


class TestAPI(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="testpassword")
        self.client = APIClient()

        self.client.login(username="testuser", password="testpassword")

        self.watchlist_data = {"name": "Bitcoin", "symbol": "BTC"}
        self.portfolio_data = {"name": "Ethereum", "symbol": "ETH", "amount": 2.5}


    def test_add_to_watchlist(self):
        response = self.client.post("/api/add-to-watchlist/", self.watchlist_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(WatchListItem.objects.filter(user=self.user, symbol="BTC").exists())

    def test_get_watchlist(self):
        WatchListItem.objects.create(user=self.user, name="Bitcoin", symbol="BTC")
        response = self.client.get("/api/get-watchlist/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["symbol"], "BTC")

    def test_delete_from_watchlist(self):
        WatchListItem.objects.create(user=self.user, name="Bitcoin", symbol="BTC")
        response = self.client.post("/api/delete-from-watchlist/", {"symbol": "BTC"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(WatchListItem.objects.filter(user=self.user, symbol="BTC").exists())

    def test_add_to_watchlist_duplicate(self):
        WatchListItem.objects.create(user=self.user, name="Bitcoin", symbol="BTC")
        response = self.client.post("/api/add-to-watchlist/", self.watchlist_data)
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)

    def test_add_to_watchlist_invalid(self):
        response = self.client.post("/api/add-to-watchlist/", {'name': "dcvbnm", 'symbol': "dcfgjk"})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


    def test_add_to_portfolio(self):
        response = self.client.post("/api/add-to-portfolio/", self.portfolio_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(PortfolioItem.objects.filter(user=self.user, symbol="ETH").exists())

    def test_get_portfolio(self):
        PortfolioItem.objects.create(user=self.user, name="Ethereum", symbol="ETH", amount=2.5)
        response = self.client.get("/api/get-portfolio/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["symbol"], "ETH")
        self.assertEqual(response.data[0]["amount"], 2.5)

    def test_update_portfolio_amount(self):
        PortfolioItem.objects.create(user=self.user, name="Ethereum", symbol="ETH", amount=2.5)
        response = self.client.post("/api/update-asset-portfolio/", {"symbol": "ETH", "amount": 5.0})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(PortfolioItem.objects.get(user=self.user, symbol="ETH").amount, 5.0)

    def test_delete_from_portfolio(self):
        PortfolioItem.objects.create(user=self.user, name="Ethereum", symbol="ETH", amount=2.5)
        response = self.client.post("/api/delete-from-portfolio/", {"symbol": "ETH"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(PortfolioItem.objects.filter(user=self.user, symbol="ETH").exists())

    def test_add_to_portfolio_invalid_data(self):
        response = self.client.post("/api/add-to-portfolio/", {"name": "Ethereum", "symbol": "ETH", "amount": -1})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_add_to_portfolio_invalid_symbol(self):
        response = self.client.post("/api/add-to-portfolio/", {"name": "SDFGHJ", "symbol": "DCFVGBNM", "amount": 0.6})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


    def test_update_portfolio_invalid_amount(self):
        PortfolioItem.objects.create(user=self.user, name="Ethereum", symbol="ETH", amount=2.5)
        response = self.client.post("/api/update-asset-portfolio/", {"symbol": "ETH", "amount": -1})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

