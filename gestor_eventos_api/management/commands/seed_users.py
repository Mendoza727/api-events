from django.core.management.base import BaseCommand
from django.contrib.auth.models import User

class Command(BaseCommand):
    help = 'Crea 5 usuarios de prueba (3 staff y 2 normales) con contraseña'

    def handle(self, *args, **kwargs):
        usuarios_data = [
            {"username": "admin1", "email": "admin1@example.com", "password": "Admin1234!", "is_staff": True},
            {"username": "admin2", "email": "admin2@example.com", "password": "Admin1234!", "is_staff": True},
            {"username": "admin3", "email": "admin3@example.com", "password": "Admin1234!", "is_staff": True},
            {"username": "user1", "email": "user1@example.com", "password": "User1234!", "is_staff": False},
            {"username": "user2", "email": "user2@example.com", "password": "User1234!", "is_staff": False},
        ]

        for data in usuarios_data:
            if not User.objects.filter(username=data["username"]).exists():
                User.objects.create_user(
                    username=data["username"],
                    email=data["email"],
                    password=data["password"],
                    is_staff=data["is_staff"]
                )
                self.stdout.write(self.style.SUCCESS(f'✅ Usuario {data["username"]} creado correctamente'))
            else:
                self.stdout.write(f'⚠️ Usuario {data["username"]} ya existe')
