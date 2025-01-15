from django.urls import path

from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('api/coins/', views.coin_list, name='coin_list'),
    path('api/chart/', views.chart_data, name='chart_data'),
    path('api/get-prices/', views.multiple_coins_price, name='coins_prices'),
]
