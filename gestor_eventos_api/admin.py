from django.contrib import admin
from .models import Events

@admin.register(Events)
class EventoAdmin(admin.ModelAdmin):
    list_display = ("name", "place", "total_tickets", "available_tickets", "ticket_price", "created_at", "updated_at", "is_active")
    search_fields = ('name',)
    list_filter = ('created_at', 'updated_at')
