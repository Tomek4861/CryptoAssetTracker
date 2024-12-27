import json

from django.contrib.auth import login
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view

from .forms import RegisterForm
from .models import WatchListItem
from django.contrib.auth.views import LoginView
from .forms import LoginForm



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
            print("Error", form.errors)
            form = RegisterForm()

    else:
        form = RegisterForm()

    return render(request, 'register/register.html', {'form': form})


class CustomLoginView(LoginView):
    authentication_form = LoginForm

@csrf_exempt
@login_required
def add_to_watchlist(request):
    if request.method == "POST":
        request_data = json.loads(request.body)
        print(request_data)
        name = request_data['name']
        symbol = request_data['symbol']
        print(name, symbol)
        if name and symbol:
            WatchListItem.objects.create(
                name=name,
                symbol=symbol,
                user=request.user
            )
            return JsonResponse(dict(success=True, msg=f"{name} added to watchlist"), status=201)
        else:
            return JsonResponse(dict(success=False, msg="Invalid data"), status=400)
    else:
        return JsonResponse(dict(success=False, msg="Invalid request method"), status=405)


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
        if symbol:
            WatchListItem.objects.filter(
                symbol=symbol,
                user=request.user
            ).delete()
            return JsonResponse(dict(success=True, msg=f"{symbol} removed from watchlist"), status=201)
        else:
            return JsonResponse(dict(success=False, msg="Invalid data"), status=400)
    else:
        return JsonResponse(dict(success=False, msg="Invalid request method"), status=405)