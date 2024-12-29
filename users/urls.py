from django.urls import path
from . import views
from .views import CustomLoginView, register, delete_from_watchlist


urlpatterns = [
    path('register/', register, name='register'),
    path('login/', CustomLoginView.as_view(), name='login'),
    path('api/add-to-watchlist/', views.add_to_watchlist, name='add_to_watchlist'),
    path('api/get-watchlist/', views.get_watchlist, name='get_watchlist'),
    path('api/delete-from-watchlist/', views.delete_from_watchlist, name='delete_from_watchlist'),
    path('api/add-to-portfolio/', views.add_to_portfolio, name='add_to_portfolio'),
    path('api/get-portfolio/', views.get_portfolio, name='get_portfolio'),
    path('api/delete-from-portfolio/', views.delete_from_portfolio, name='delete_from_portfolio'),
    path('api/update-asset-portfolio/', views.update_amount_portfolio, name='update_amount_portfolio'),

]
