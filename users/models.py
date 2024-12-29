from django.db import models
from django.contrib.auth.models import User


# Create your models here.

class WatchListItem(models.Model):
    name = models.CharField(max_length=100)
    symbol = models.CharField(max_length=10)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'symbol'], name='unique_user_symbol')
        ]

    def __str__(self):
        return self.name


class PortfolioItem(models.Model):
    name = models.CharField(max_length=100)
    symbol = models.CharField(max_length=10)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.FloatField()

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'symbol'], name='unique_user_symbol_portfolio')
        ]

    def __str__(self):
        return self.name