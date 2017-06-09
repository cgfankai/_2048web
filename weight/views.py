from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.http import require_POST
from . import models
import time
# Create your views here.
def index(request):
    return render(request,'index.html')

lastSetWeight = [0];
_1_HOUR = 1000 * 60 * 60;
@require_POST
def setWeight(request):
    if request.method == "POST":
        print(request.POST)
        weight = request.POST['weight']
        time_stamp = int(round(time.time()*1000))
        if(time_stamp - lastSetWeight[0] > _1_HOUR):
            lastSetWeight[0] = time_stamp
            a = models.Weight(weight=weight,time_stamp=time_stamp)
            a.save()
            return HttpResponse('success set weight.')
        else:
            return HttpResponse('1h内已经设置过了。')
