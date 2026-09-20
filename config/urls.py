from django.urls import path, include
from .routes import api

urlpatterns = [
    path('api/', api.urls)
]