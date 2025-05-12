from django.urls import path
from .views import *

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('eventos/', EventsView.as_view(), name='eventos_list'),
    path('eventos/<int:id>/', EventDetailView.as_view(), name='evento_detail'),
    path('eventos/<int:id>/vender', EventSoldView.as_view(), name='evento_vender'),
]