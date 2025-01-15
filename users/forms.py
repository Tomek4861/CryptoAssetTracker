from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth.models import User



class RegisterForm(UserCreationForm):
    username = forms.CharField(
        widget=forms.TextInput(attrs={"class": "form-control", "placeholder": "Username"}),
        help_text=None
    )
    password1 = forms.CharField(
        widget=forms.PasswordInput(attrs={"class": "form-control", "placeholder": "Password"}),
        help_text=None, label="Password"
    )
    password2 = forms.CharField(
        widget=forms.PasswordInput(attrs={"class": "form-control", "placeholder": "Confirm Password"}),
        help_text=None, label="Confirm Password"
    )

    class Meta:
        model = User
        fields = ["username", "password1", "password2"]


class LoginForm(AuthenticationForm):
    username = forms.CharField(
        widget=forms.TextInput(attrs={"class": "form-control", "placeholder": "Username"}),
        help_text=None
    )
    password = forms.CharField(
        widget=forms.PasswordInput(attrs={"class": "form-control", "placeholder": "Password"}),
        help_text=None
    )

    class Meta:
        model = User
        fields = ["username", "password"]



# class PortfolioForm(forms.Form):
#     COINS_LIST = list(COINS.items())
#
#     coin = forms.ChoiceField(choices=COINS_LIST, label="Coin", required=True, widget=forms.Select(attrs={"class": "form-select mb-3"}))
#     amount = forms.FloatField(label="Amount", widget=forms.NumberInput(attrs={"class": "form-control mb-3"}) )
#
#
