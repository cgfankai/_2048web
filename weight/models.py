from django.db import models
# Create your models here.
class Weight(models.Model):
    user_id = models.TextField(max_length=36)
    weight = models.FloatField()
    time_stamp = models.BigIntegerField()
    def __str__(self):
        return