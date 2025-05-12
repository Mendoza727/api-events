from django.db import models
from datetime import datetime

class Events(models.Model):
    name = models.CharField(max_length=255)
    place = models.CharField(max_length=255)
    total_tickets = models.PositiveIntegerField()
    available_tickets = models.PositiveIntegerField()
    ticket_price = models.DecimalField(max_digits=10, decimal_places=2)
    dateHourToEvent = models.DateTimeField()
    created_at = models.DateTimeField(default=datetime.now())
    updated_at = models.DateTimeField(default=datetime.now())
    is_active = models.BooleanField(default=1)

    def __str__(self):
        return self.name
    
    def sold_tickets(self, quantity):
        if quantity <= self.available_tickets:
            self.available_tickets -=quantity
            self.save()
            return True
        return False