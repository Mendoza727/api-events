from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Events
from datetime import datetime

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            validated_data['username'],
            validated_data['email'],
            validated_data['password']
        )
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

class EventsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Events
        fields = '__all__'
        read_only_fields = ['id']

    def validate(self, data):
        errores = {}

        # Verifica si se está actualizando el campo 'name'
        if 'name' in data and not data.get('name'):
            errores['nombre'] = 'El nombre es obligatorio.'

        # Verifica si se está actualizando el campo 'dateHourToEvent'
        if 'dateHourToEvent' in data and not data.get('dateHourToEvent'):
            errores['dateHourToEvent'] = 'La fecha y hora son obligatorias.'

        # Verifica si se está actualizando el campo 'total_tickets'
        if 'total_tickets' in data:
            if data['total_tickets'] is None or data['total_tickets'] < 1:
                errores['total_tickets'] = 'Debe haber al menos 1 boleto disponible.'

        if errores:
            raise serializers.ValidationError(errores)

        return data
