from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.http import require_POST
from django.core.serializers import serialize
import json
from . import models
import time
# Create your views here.
def index(request):
    return render(request,'index.html')

lastSetWeight = 0;
_12_HOUR = 1000 * 60 * 60 * 12;
@require_POST
def setWeight(request):
    if request.method == "POST":
        global lastSetWeight
        weight = json.loads(request.body)['weight']
        time_stamp = int(round(time.time()*1000))
        if(time_stamp - lastSetWeight > _12_HOUR):
            lastSetWeight = time_stamp
            a = models.Weight(weight=weight,time_stamp=time_stamp)
            a.save()
            return HttpResponse('success set weight.' + weight)
        else:
            return HttpResponse('12h内已经设置过了。')

def getWeights(request):
    data = models.Weight.objects.all();
    return HttpResponse(serialize('json',data))

def getUpdateTimeStamp(request):
    global lastSetWeight
    return HttpResponse(lastSetWeight)