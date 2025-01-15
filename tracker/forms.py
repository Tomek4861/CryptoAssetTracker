from django import forms

from tracker.utils import COINS, CURRENCIES, CHART_COLORS, TIMEFRAMES


class OptionsForm(forms.Form):
    COINS_LIST = list(COINS.items())

    CURRENCIES_LIST = [(currency, currency) for currency in CURRENCIES]
    TIMEFRAMES_LIST = [(timeframe, timeframe.upper()) for timeframe in TIMEFRAMES]

    CHART_COLORS_LIST = [(",".join(v), k) for k, v in CHART_COLORS.items()]

    coin = forms.ChoiceField(choices=COINS_LIST, label="Coin", required=True,
                             widget=forms.Select(attrs={"class": "form-select mb-3"}))
    currency = forms.ChoiceField(choices=CURRENCIES_LIST, label="Currency",
                                 widget=forms.Select(attrs={"class": "form-select mb-3"}))
    timeframe = forms.ChoiceField(choices=TIMEFRAMES_LIST, label="Timeframe",
                                  widget=forms.Select(attrs={"class": "form-select mb-3"}))
    chart_color = forms.ChoiceField(choices=CHART_COLORS_LIST, label="Chart Colors",
                                    widget=forms.Select(attrs={"class": "form-select mb-3"}))
