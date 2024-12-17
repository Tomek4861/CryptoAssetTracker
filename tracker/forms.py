from django import forms


class OptionsForm(forms.Form):
    COINS = [
        ("Bitcoin", "Bitcoin (BTC)"),
        ("Ethereum", "Ethereum (ETH)"),
        ("Solana", "Solana (SOL)"),
    ]
    CURRENCIES = [
        ("USD", "USD"),
        ("EUR", "EUR"),
        ("PLN", "PLN"),
    ]
    TIMEFRAMES = [
        ("1d", "1D"),
        ("2d", "2D"),
        ("1w", "1W"),
        ("1m", "1M"),
        ("1y", "1Y"),
    ]
    CHART_TYPES = [
        ("candlestick", "Candle Stick"),
    ]

    coin = forms.ChoiceField(choices=COINS, label="Coin", required=True, widget=forms.Select(attrs={"class": "form-select mb-3"}))
    currency = forms.ChoiceField(choices=CURRENCIES, label="Currency",  widget=forms.Select(attrs={"class": "form-select mb-3"}))
    timeframe = forms.ChoiceField(choices=TIMEFRAMES, label="Timeframe", widget=forms.Select(attrs={"class": "form-select mb-3"}))
    chart_type = forms.ChoiceField(choices=CHART_TYPES, label="Chart Type", widget=forms.Select(attrs={"class": "form-select mb-3"}))
