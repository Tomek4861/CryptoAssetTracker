from django.contrib import messages
from django.contrib.auth import login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.views import LoginView
from django.db import IntegrityError
from django.shortcuts import render, redirect
from rest_framework.decorators import permission_classes, api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from tracker.utils import COINS
from .forms import LoginForm
from .forms import RegisterForm
from .models import WatchListItem, PortfolioItem


# Create your views here.

def register(request):
    if request.user.is_authenticated:
        return redirect('/')

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
    redirect_authenticated_user = True

    def form_invalid(self, form):
        messages.error(self.request, "Invalid username or password.")
        return super().form_invalid(form)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_watchlist(request):
    request_data = request.data
    print(request_data)
    name = request_data['name']
    symbol = request_data['symbol']
    print(name, symbol)
    if not name or not symbol:
        return Response(dict(success=False, message="Invalid data"), status=400)
    try:
        WatchListItem.objects.create(user=request.user, name=name, symbol=symbol)
        return Response(dict(success=True, message=f"{name} added to watchlist"), status=201)
    except IntegrityError:
        return Response({'success': False, 'message': 'Item already in watchlist'}, status=409)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_watchlist(request):
    watchlist_items = WatchListItem.objects.filter(user=request.user)
    data = [{"name": item.name, "symbol": item.symbol} for item in watchlist_items]
    return Response(data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def delete_from_watchlist(request):
    request_data = request.data
    print(request_data)
    symbol = request_data['symbol']
    if not symbol:
        return Response(dict(success=False, message="Invalid data"), status=400)
    deleted_count, _ = WatchListItem.objects.filter(symbol=symbol, user=request.user).delete()
    if not deleted_count:
        return Response(dict(success=False, message=f"{symbol} not found in watchlist"), status=404)
    else:
        return Response(dict(success=True, message=f"{symbol} removed from watchlist"), status=200)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_portfolio(request):
    request_data = request.data
    print(request_data)
    name = request_data.get('name')
    symbol = request_data.get('symbol')
    try:
        amount = float(request_data.get('amount'))
    except (ValueError, TypeError):
        return Response(dict(success=False, message="Invalid amount"), status=400)
    # print(name, symbol, amount)

    if not name or not symbol:
        return Response(dict(success=False, message="Invalid data"), status=400)
    if amount <= 0:
        return Response(dict(success=False, message="Invalid amount"), status=400)
    try:
        PortfolioItem.objects.create(user=request.user, name=name, symbol=symbol, amount=amount)
        return Response(dict(success=True, message=f"{amount} {symbol} added to portfolio"), status=201)
    except IntegrityError:
        return Response(dict(success=False, message='Item already in portfolio'), status=409)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_amount_portfolio(request):
    request_data = request.data
    symbol = request_data.get('symbol')

    try:
        amount = float(request_data.get('amount'))
    except (ValueError, TypeError):
        return Response(dict(success=False, message="Invalid amount"), status=400)

    if not symbol or amount is None or amount < 0:
        return Response(dict(success=False, message='Invalid data'), status=400)

    if amount == 0:
        PortfolioItem.objects.filter(symbol=symbol, user=request.user).delete()
        return Response(dict(success=True, message=f'{symbol} removed from portfolio'), status=200)

    try:
        updated_count = PortfolioItem.objects.filter(symbol=symbol, user=request.user).update(amount=amount)
        if not updated_count:
            return Response(dict(success=False, message=f'{symbol} not found in portfolio'), status=404)
        return Response(dict(success=True, message=f'{symbol} amount updated to {amount}'), status=200)
    except IntegrityError:
        return Response(dict(success=False, message='Integrity Error'), status=409)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def delete_from_portfolio(request):
    request_data = request.data
    symbol = request_data.get('symbol')
    if symbol:
        deleted_count, _ = PortfolioItem.objects.filter(symbol=symbol, user=request.user).delete()
        if not deleted_count:
            return Response(dict(success=False, message=f"{symbol} not found in portfolio"), status=404)
        else:
            return Response(dict(success=True, message=f"{symbol} removed from portfolio"), status=200)
    else:
        return Response(dict(success=False, message="Invalid data"), status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_portfolio(request):
    portfolio_items = PortfolioItem.objects.filter(user=request.user)
    data = [{"name": item.name, "symbol": item.symbol, "amount": item.amount} for item in portfolio_items]
    return Response(data, status=200)


@login_required
def get_portfolio_page(request):
    all_coins_list = list(COINS.items())
    return render(request, 'portfolio/portfolio.html', dict(coins=all_coins_list))
