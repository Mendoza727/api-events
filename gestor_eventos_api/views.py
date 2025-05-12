from .serializers import UserSerializer, LoginSerializer, EventsSerializer
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .models import Events
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework_simplejwt.exceptions import InvalidToken, TokenBackendError
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

# Manejamos el error por token expirado o faltante
class TokenValidationMixin:
    def check_token(self, request):
        try:
            # Esto verifica el token automáticamente
            user = request.user
            if user and user.is_authenticated:
                return None
            return Response({"error": "Token inválido o expirado."}, status=status.HTTP_401_UNAUTHORIZED)
        except (InvalidToken, TokenBackendError) as e:
            return Response({"error": str(e)}, status=status.HTTP_401_UNAUTHORIZED)

class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'username': user.username,
                'is_staff': user.is_staff,
                "message": "User created successfully."
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = authenticate(
                username=serializer.validated_data['username'],
                password=serializer.validated_data['password']
            )
            if user:
                refresh = RefreshToken.for_user(user)
                return Response({
                    'refresh': str(refresh),
                    'username': user.username,
                    'is_staff': user.is_staff,
                    'access': str(refresh.access_token)
                })
            return Response({"error": "Credenciales Invalidad"}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)      

class EventsView(TokenValidationMixin, APIView):
    permission_classes = [IsAuthenticated]  # Protección JWT

    def get(self, request):
        token_error = self.check_token(request)
        if token_error:
            return token_error
        
        try:
            eventos = Events.objects.filter(is_active=True)
            serializer = EventsSerializer(eventos, many=True)
            return Response({
                "message": "Eventos obtenidos correctamente.",
                "status": "success",
                "data": serializer.data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                "message": "Ocurrió un error al obtener los eventos.",
                "status": "error",
                "error": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        # Verificación de token
        token_error = self.check_token(request)
        if token_error:
            return token_error
        
        try:
            serializer = EventsSerializer(data=request.data)
            if serializer.is_valid():
                total = serializer.validated_data['total_tickets']
                event = serializer.save(available_tickets=total)  # Guardar el evento y obtener la instancia
                # Ahora podemos acceder al ID del evento recién creado
                return Response({
                    "message": "Evento creado correctamente.",
                    "status": "success",
                    "data": serializer.data,
                    "id": event.id  # Agregar el ID del evento en la respuesta
                }, status=status.HTTP_201_CREATED)
            
            return Response({
                "message": "Los datos proporcionados son inválidos.",
                "status": "error",
                "details": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            return Response({
                "message": "Ocurrió un error al crear el evento.",
                "status": "error",
                "error": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class EventDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def check_token(self, request):
        user = request.user
        if user and user.is_authenticated:
            return None
        return Response({"error": "Token inválido o expirado."}, status=status.HTTP_401_UNAUTHORIZED)

    def get_object(self, id):
        return get_object_or_404(Events, id=id, is_active=True)

    def get(self, request, id):
        token_error = self.check_token(request)
        if token_error:
            return token_error

        try:
            evento = self.get_object(id)
            serializer = EventsSerializer(evento)
            return Response({
                "message": "Evento encontrado.",
                "status": "success",
                "data": serializer.data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                "message": "No se pudo obtener el evento.",
                "status": "error",
                "error": str(e)
            }, status=status.HTTP_404_NOT_FOUND)

    def patch(self, request, id):
        token_error = self.check_token(request)
        if token_error:
            return token_error

        try:
            evento = self.get_object(id)
            serializer = EventsSerializer(evento, data=request.data, partial=True)
            if serializer.is_valid():
                if 'total_tickets' in serializer.validated_data:
                    diff = serializer.validated_data['total_tickets'] - evento.total_tickets
                    evento.available_tickets += diff
                serializer.save()
                return Response({
                    "message": "Evento actualizado parcialmente.",
                    "status": "success",
                    "data": serializer.data
                })
            return Response({
                "message": "Datos inválidos.",
                "status": "error",
                "details": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                "message": "Error al actualizar parcialmente el evento.",
                "status": "error",
                "error": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, id):
        # Verificar el token
        token_error = self.check_token(request)
        if token_error:
            return token_error

        try:
            # Obtener el evento por su ID
            evento = self.get_object(id)

            # Desactivar el evento
            evento.is_active = False
            evento.save()

            # Respuesta de éxito con código 200
            return Response({
                "message": "Evento desactivado correctamente.",
                "status": "success"
            }, status=status.HTTP_200_OK)  # Cambié el código a 200 OK

        except Exception as e:
            # Respuesta de error si algo falla
            return Response({
                "message": "Error al desactivar el evento.",
                "status": "error",
                "error": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class EventSoldView(APIView):
    permission_classes = [IsAuthenticated]  # Solo usuarios autenticados pueden acceder

    def post(self, request, id):
        # Verificación de token
        token_error = self.check_token(request)
        if token_error:
            return token_error
        
        try:
            evento = get_object_or_404(Events, id=id)
            quantity = int(request.data.get("cantidad", 0))

            # Validamos la cantidad de boletos solicitada
            if quantity <= 0:
                return Response({
                    "message": "La cantidad debe ser mayor a 0.",
                    "status": "error"
                }, status=status.HTTP_400_BAD_REQUEST)

            # Intentamos vender los boletos
            if evento.sold_tickets(quantity):
                return Response({
                    "message": f"{quantity} boleto(s) comprado(s) correctamente.",
                    "status": "success",
                    "boletos_disponibles": evento.available_tickets
                }, status=status.HTTP_200_OK)

            return Response({
                "message": "No hay suficientes boletos disponibles.",
                "status": "error"
            }, status=status.HTTP_400_BAD_REQUEST)
        except ValueError as ve:
            return Response({
                "message": "Evento no encontrado.",
                "status": "error",
                "error": str(ve)
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                "message": "Ocurrió un error al vender boletos.",
                "status": "error",
                "error": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)