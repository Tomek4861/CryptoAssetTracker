from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response

from tracker.forms import OptionsForm
from tracker.utils import COINS, DEFAULT_COIN_DATA
from .utils import get_coin_historical_prices, convert_to_days, get_coins_current_price


# Create your views here.
def home(request):
    form = OptionsForm(request.GET or None, initial=DEFAULT_COIN_DATA)
    if form.is_valid():
        print("Form is valid")
        coin = form.cleaned_data["coin"]
        _data = get_coin_historical_prices(coin, DEFAULT_COIN_DATA['currency'], convert_to_days(
            request.GET.get("timeframe", DEFAULT_COIN_DATA['timeframe'])))
    else:
        print("Error", form.errors)
        # print(form, form.is_valid())
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
    coin = request.GET.get("coin", DEFAULT_COIN_DATA["coin"])
    currency = request.GET.get("currency", DEFAULT_COIN_DATA["currency"])
    print("OHO", request.GET)
    price = get_coin_historical_prices(COINS[coin], currency,
                                       convert_to_days(request.GET.get("timeframe", DEFAULT_COIN_DATA["timeframe"])))
    return Response(price)


@api_view(['GET'])
def multiple_coins_price(request):
    coins = request.GET.getlist("coins[]")
    currency = request.GET.get("currency", DEFAULT_COIN_DATA["currency"])
    print(coins)
    prices = get_coins_current_price(coins, currency)
    return Response(prices)
