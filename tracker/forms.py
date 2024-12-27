from django import forms

from tracker.utils import inverse_dict, COINS, CURRENCIES


class OptionsForm(forms.Form):
    COINS_LIST = list(COINS.items())

    CURRENCIES_LIST = [(currency, currency) for currency in CURRENCIES]
    TIMEFRAMES = [
        ("1d", "1D"),
        ("1w", "1W"),
        ("1m", "1M"),
        ("1y", "1Y"),
    ]
    CHART_TYPES = [
        ("candlestick", "Candle Stick"),
    ]

    coin = forms.ChoiceField(choices=COINS_LIST, label="Coin", required=True, widget=forms.Select(attrs={"class": "form-select mb-3"}))
    currency = forms.ChoiceField(choices=CURRENCIES_LIST, label="Currency",  widget=forms.Select(attrs={"class": "form-select mb-3"}))
    timeframe = forms.ChoiceField(choices=TIMEFRAMES, label="Timeframe", widget=forms.Select(attrs={"class": "form-select mb-3"}))
    chart_type = forms.ChoiceField(choices=CHART_TYPES, label="Chart Type", widget=forms.Select(attrs={"class": "form-select mb-3"}))
