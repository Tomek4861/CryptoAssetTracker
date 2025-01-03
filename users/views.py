import json

from django.contrib import messages
from django.contrib.auth import login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.views import LoginView
from django.db import IntegrityError
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt

from tracker.utils import COINS
from .forms import LoginForm
from .forms import RegisterForm
from .models import WatchListItem, PortfolioItem


# Create your views here.

def register(request):
    if request.method == "POST":
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = form.save()
            print(f"User {user.username} created!")
            login(request, user)
            return redirect('/')
        else:
            messages.error(request, "Error during registration. Please try again.")

    else:
        form = RegisterForm()

    return render(request, 'register/register.html', {'form': form})


class CustomLoginView(LoginView):
    authentication_form = LoginForm

    def form_invalid(self, form):
        messages.error(self.request, "Invalid username or password.")
        return super().form_invalid(form)


@csrf_exempt
@login_required
def add_to_watchlist(request):
    if request.method == "POST":
        request_data = json.loads(request.body)
        print(request_data)
        name = request_data['name']
        symbol = request_data['symbol']
        print(name, symbol)
        if not name or not symbol:
            return JsonResponse(dict(success=False, message="Invalid data"), status=400)
        try:
            WatchListItem.objects.create(user=request.user, name=name, symbol=symbol)
            return JsonResponse(dict(success=True, message=f"{name} added to watchlist"), status=201)
        except IntegrityError:
            return JsonResponse({'success': False, 'message': 'Item already in watchlist'}, status=400)
    else:
        return JsonResponse(dict(success=False, message="Invalid request method"), status=405)


@login_required
def get_watchlist(request):
    watchlist_items = WatchListItem.objects.filter(user=request.user)
    data = [{"name": item.name, "symbol": item.symbol} for item in watchlist_items]
    return JsonResponse(data, safe=False)


@csrf_exempt
@login_required
def delete_from_watchlist(request):
    if request.method == "POST":
        request_data = json.loads(request.body)
        print(request_data)
        symbol = request_data['symbol']
        if not symbol:
            return JsonResponse(dict(success=False, message="Invalid data"), status=400)
        WatchListItem.objects.filter(
            symbol=symbol,
            user=request.user
        ).delete()
        return JsonResponse(dict(success=True, message=f"{symbol} removed from watchlist"), status=201)
    else:
        return JsonResponse(dict(success=False, message="Invalid request method"), status=405)


@csrf_exempt
@login_required
def add_to_portfolio(request):
    if request.method == "POST":
        request_data = json.loads(request.body)
        print(request_data)
        name = request_data['name']
        symbol = request_data['symbol']
        amount = request_data['amount']
        print(name, symbol, amount)
        if not name or not symbol:
            return JsonResponse(dict(success=False, message="Invalid data"), status=400)
        if amount <= 0:
            return JsonResponse(dict(success=False, message="Invalid amount"), status=400)
        try:
            PortfolioItem.objects.create(user=request.user, name=name, symbol=symbol, amount=amount)
            return JsonResponse(dict(success=True, message=f"{amount} {symbol} added to portfolio"), status=201)
        except IntegrityError:
            return JsonResponse(dict(success=False, message='Item already in portfolio'), status=400)
    else:
        return JsonResponse(dict(success=False, message="Invalid request method"), status=405)


@csrf_exempt
@login_required
def update_amount_portfolio(request):
    if request.method == "POST":
        request_data = json.loads(request.body)
        symbol = request_data['symbol']
        amount = request_data['amount']
        print(symbol, amount)
        if not symbol or amount < 0:
            return JsonResponse(dict(success=False, message="Invalid data"), status=400)
        if amount == 0:
            PortfolioItem.objects.filter(symbol=symbol, user=request.user).delete()
            return JsonResponse(dict(success=True, message=f"{symbol} removed from portfolio"), status=200)
        try:
            PortfolioItem.objects.filter(
                symbol=symbol,
                user=request.user
            ).update(amount=amount)
            return JsonResponse(dict(success=True, message=f"{symbol} amount change {amount}"), status=201)
        except IntegrityError:
            return JsonResponse({'success': False, 'message': 'Integrity Error'}, status=400)
    else:
        return JsonResponse(dict(success=False, message="Invalid request method"), status=405)


def delete_from_portfolio(request):
    if request.method == "POST":
        request_data = json.loads(request.body)
        symbol = request_data['symbol']
        if symbol:
            try:
                PortfolioItem.objects.filter(
                    symbol=symbol,
                    user=request.user
                ).delete()
                return JsonResponse(dict(success=True, message=f"{symbol} removed from portfolio"), status=201)
            except IntegrityError:
                return JsonResponse({'success': False, 'message': 'Integrity Error'}, status=400)
        else:
            return JsonResponse(dict(success=False, message="Invalid data"), status=400)
    else:
        return JsonResponse(dict(success=False, message="Invalid request method"), status=405)


@login_required
def get_portfolio(request):
    portfolio_items = PortfolioItem.objects.filter(user=request.user)
    data = [{"name": item.name, "symbol": item.symbol, "amount": item.amount} for item in portfolio_items]
    return JsonResponse(data, safe=False)


@login_required
def get_portfolio_page(request):
    all_coins_list = list(COINS.items())
    return render(request, 'portfolio/portfolio.html', dict(coins=all_coins_list))
