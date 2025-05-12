# API Events

[![Python 3.9+](https://img.shields.io/badge/python-3.9%2B-3776AB?logo=python&logoColor=white)](https://www.python.org/)  
[![Django 3.2+](https://img.shields.io/badge/django-3.2%2B-092E20?logo=django&logoColor=white)](https://www.djangoproject.com/)  
[![React 18](https://img.shields.io/badge/react-18-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)  
[![Licencia: TTP](https://img.shields.io/badge/licencia-PRUEBA%20T%C3%89CNICA-blue)]()  
[![Estado de build](https://img.shields.io/github/actions/workflow/status/Mendoza727/api-events/ci.yml?branch=main)](https://github.com/Mendoza727/api-events/actions)  
[![Cobertura de tests](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/tuusuario/coverage-badge.json)]()

_Proyecto de prueba técnica: API REST con Django + frontend React para gestión de eventos._

---

## 📂 Estructura del proyecto

```bash
api-events/
├── gestor_eventos_api/       # Proyecto Django REST API
│   ├── eventos/              # App Django para eventos (models, serializers, views)
│   ├── manage.py
│   └── requirements.txt      # Dependencias Python
├── gestor_eventos/           # (Opcional) Proyecto Django monolítico
├── eventsHub/                # Frontend React
│   ├── src/
│   ├── package.json
│   └── package-lock.json
├── .gitignore
└── README.md                 # ← este archivo
```
🚀 Características
Operaciones CRUD para eventos (/eventos/)

Soft-delete: marca eventos con is_active = false en lugar de eliminarlos

Autenticación por token (DRF TokenAuth o JWT)

Frontend React con Tailwind CSS

Validación de formularios y mensajes de error amigables

Panel de administración de Django para superusuarios

⚙️ Instalación Rápida
1. Clonar el repositorio
```bash

git clone https://github.com/Mendoza727/api-events.git
cd api-events
```
2. Backend (Django REST API)
```bash
cd gestor_eventos_api
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt


# Copiar y configurar variables de entorno:
cp .env.example .env
# Editar .env con:
# DB_NAME DB_USER=root DB_PASSWORD= DB_HOST= DB_PORT=
# proyecto hecho con mysql


python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
API disponible en: http://127.0.0.1:8000/
```

Endpoints de eventos:

Método	Ruta	Descripción
GET	/eventos/	Listar todos los eventos
POST	/eventos/	Crear un nuevo evento
GET	/eventos/{id}/	Obtener un evento por ID
PATCH	/eventos/{id}/	Actualizar un evento
DELETE	/eventos/{id}/	Desactivar (soft-delete)

📁 Estructura de carpetas
```csharp
api-events/
├── gestor_eventos_api/   # Django REST Framework
│   ├── eventos/          # app de eventos
│   ├── manage.py
│   └── requirements.txt
├── eventsHub/            # Frontend React
│   ├── src/
│   ├── package.json
│   └── package-lock.json
├── .env.example
├── .gitignore
└── README.md
```
📝 Licencia
SOLO PARA PRUEBA TÉCNICA
Este código se proporciona únicamente para evaluación en una prueba técnica.
Queda prohibida su utilización, reproducción o distribución fuera de este contexto.

Licencia de Prueba Técnica (LPT)
--------------------------------
Se concede al evaluador permiso para usar, revisar y probar este código  
con el único fin de evaluar las habilidades técnicas del candidato.  
Todos los demás derechos quedan reservados al autor.

EL SOFTWARE SE PROPORCIONA "TAL CUAL", SIN GARANTÍA DE NINGÚN TIPO.
