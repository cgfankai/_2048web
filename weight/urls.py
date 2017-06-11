from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^setWeight$', views.setWeight),
    url(r'^getWeights$', views.getWeights)
]
