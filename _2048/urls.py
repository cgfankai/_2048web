from django.conf.urls import url
from django.conf.urls.static import static
from . import views

urlpatterns = [
    url(r'^$', views.index),
    url(r'^(?P<user_id>[0-9]+)$', views.user, name='user_id'),
]