from datetime import datetime
from .utils import get_coin_prices, convert_to_days
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response

from tracker.forms import OptionsForm


COINS = [
    {"name": "Bitcoin", "symbol": "BTC"},
    {"name": "Ethereum", "symbol": "ETH"},
    {"name": "Solana", "symbol": "SOL"},

]


# Create your views here.
def home(request):
    print(" sie")
    initial_data = dict(coin="Bitcoin", currency="USD", timeframe="1w", chart_type="candlestick")
    form = OptionsForm(request.GET or None, initial=initial_data)
    if form.is_valid():
        coin = form.cleaned_data["coin"]
        _data = get_coin_prices(coin, "USD", convert_to_days(request.GET.get("timeframe", "1w")))
    else:
        print("Error" + str(form.errors))
        print(form, form.is_valid())
        return render(request, 'index.html', {"form": form})

    context = {
        "form": form,
        "chart_data": _data,
    }
    return render(request, 'index.html', context)


@api_view(['GET'])
def coin_list(request):
    return Response({"coins": COINS})



@api_view(['GET'])
def chart_data(request):
    coin = request.GET.get("coin", "Bitcoin")
    currency = request.GET.get("currency", "USD")
    print("OHO", request.GET)
    price = get_coin_prices(coin, currency, convert_to_days(request.GET.get("timeframe", "1w")))
    return Response(price)
