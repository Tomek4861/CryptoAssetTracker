from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.cache import cache

from tracker.forms import OptionsForm
from tracker.utils import COINS, DEFAULT_COIN_DATA, CACHE_TIMEOUT
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
    timeframe = request.GET.get("timeframe", DEFAULT_COIN_DATA["timeframe"])
    cache_key = f"{coin}_{currency}_{timeframe}"
    cached_data = cache.get(cache_key)
    if cached_data:
        print(f"Cache Hit for {cache_key}")
        return Response(cached_data)
    else:
        print("Cache Miss")
        data = get_coin_historical_prices(coin, currency, convert_to_days(timeframe))
        cache.set(cache_key, data, CACHE_TIMEOUT)
        return Response(data)


@api_view(['GET'])
def multiple_coins_price(request):
    if not (coins := request.GET.getlist("coins[]")):
        return Response({"error": "No coins provided"}, status=400)
    currency = request.GET.get("currency", DEFAULT_COIN_DATA["currency"])
    cache_key = f"{currency}_{'_'.join(coins)}_{currency}"
    cached_data = cache.get(cache_key)
    if cached_data:
        print(f"Cache Hit for {cache_key}")
        return Response(cached_data)
    else:
        print("Cache Miss")
        prices = get_coins_current_price(coins, currency)
        cache.set(cache_key, prices, CACHE_TIMEOUT)
        return Response(prices)
