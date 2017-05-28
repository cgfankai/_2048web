from django.shortcuts import render
from  django.http import HttpResponse

# Create your views here.

def index(request):
    return render(request,r'_2048/index.html',{})
def weather(request,longitude,latitude):

    return HttpResponse("Hello, world. You're at the 2048 index. %s     =====  %s " % (longitude,latitude));