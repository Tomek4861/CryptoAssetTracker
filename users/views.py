import json

from django.contrib import messages
from django.contrib.auth import login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.views import LoginView
from django.db import IntegrityError
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt

from .forms import LoginForm
from .forms import RegisterForm
from .models import WatchListItem


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
        if name and symbol:
            try:
                WatchListItem.objects.create(user=request.user, name=name, symbol=symbol)
                return JsonResponse(dict(success=True, msg=f"{name} added to watchlist"), status=201)
            except IntegrityError:
                return JsonResponse({'success': False, 'message': 'Item already in watchlist'}, status=400)
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
