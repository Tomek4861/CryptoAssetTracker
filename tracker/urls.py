from django.urls import path
from . import views
from .views import home, coin_list, chart_data

urlpatterns = [
    path('', views.home, name='home'),
    path('api/coins/', views.coin_list, name='coin_list'),
    path('api/chart/', views.chart_data, name='chart_data'),
]
