from django.shortcuts import render, redirect
from django.contrib.auth import login

from .forms import RegisterForm


# Create your views here.

def register(request):
    if request.method == "POST":
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = form.save()
            print(f"User {user.username} created!")
            login(request, user)
            return redirect('')
        else:
            print("Error", form.errors)
            form = RegisterForm()

    else:
        form = RegisterForm()

    return render(request, 'register/register.html', {'form': form})
