from django.shortcuts import render
from  django.http import HttpResponse
from django.template import loader

# Create your views here.

def index(request):
    return render(request,r'_2048/index.html',{})
def user(request,user_id):
    return HttpResponse("Hello, world. You're at the 2048 index. %s" % user_id )