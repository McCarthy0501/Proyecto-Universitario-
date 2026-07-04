# Tienda Salas Sanchez - E-commerce Full Stack

Sistema de e-commerce con backend Django + API REST y frontend React + Vite.

## Requisitos

- Python 3.10+ con pip
- Node.js 18+ con npm
- PostgreSQL 14+
- Git

## Instalación

### 1. Clonar el repositorio

```bash
git clone <repo-url>
cd Proyecto_UniversidadV2_1
```

### 2. Backend (Django)

```bash
cd BackEnd/proyectoIII

# Crear y activar entorno virtual
python -m venv env
env\Scripts\activate     # Windows
# source env/bin/activate  # Mac/Linux

# Instalar dependencias
cd ecommerce-main
pip install -r requirements.txt
```

### 3. Configurar base de datos

Crear la base de datos en PostgreSQL:

```sql
CREATE DATABASE ecommerce_db;
```

Usar el usuario por defecto o crear uno nuevo. Luego editar `.env`:

```
SECRET_KEY=tu-clave-secreta-aqui
DB_NAME=ecommerce_db
DB_USER=postgres
DB_PASSWORD=tu-password
DB_HOST=127.0.0.1
DB_PORT=5432
RECOVERY_CODE=TiendaSalas2026$$
```

### 4. Migraciones y superusuario

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
```

Sigue las instrucciones interactivas (email, nombre, contraseña).

### 5. Frontend (React)

```bash
cd ../../../tienda_salas_sanchez

# Instalar dependencias
npm install
```

Configurar la URL del backend (opcional, por defecto localhost:8000):

```
VITE_API_URL=http://localhost:8000
```

Este valor ya está en el archivo `.env`.

### 6. Ejecutar

**Terminal 1 - Backend:**
```bash
cd BackEnd/proyectoIII/ecommerce-main
..\env\Scripts\activate    # Windows
python manage.py runserver
```

**Terminal 2 - Frontend:**
```bash
cd tienda_salas_sanchez
npm run dev
```

- Tienda: http://localhost:5173
- Panel admin: http://localhost:5173/#/admin
- API: http://localhost:8000/api/

## Estructura del proyecto

```
Proyecto_UniversidadV2_1/
├── BackEnd/proyectoIII/ecommerce-main/   # Django backend
│   ├── accounts/      # Usuarios y perfiles
│   ├── category/      # Categorías de productos
│   ├── store/         # Productos, variaciones, reseñas
│   ├── carts/         # Carrito de compras
│   ├── orders/        # Pedidos y pagos
│   ├── api/           # API REST (ViewSets + APIViews)
│   ├── gestion/       # Panel admin vía templates Django
│   └── ecommerce/     # Configuración principal
│
├── tienda_salas_sanchez/                 # React frontend
│   └── src/
│       ├── pages/         # Páginas (ecomerce + admin)
│       ├── components/    # Componentes reutilizables + admin
│       ├── contexts/      # Auth, Cart, AdminAuth, ExchangeRate
│       ├── Hooks/main/    # Hooks personalizados
│       └── api.js         # Cliente API centralizado
│
└── .env                  # Variables de entorno del backend
```

## Funcionalidades

- Catálogo de productos con paginación, filtros y búsqueda
- Categorías con imágenes
- Detalle de producto con galería, variaciones y reseñas
- Carrito de compras con persistencia local + backend
- Checkout en 4 pasos con múltiples métodos de pago
- Registro e inicio de sesión con JWT
- Recuperación de contraseña
- Panel de administración con:
  - Dashboard de estadísticas
  - CRUD de productos y categorías
  - Gestión de usuarios y pedidos
  - Tasa de cambio BCV (manual/automática)
  - Recuperación de admin por código maestro

## Variables de entorno (.env)

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `SECRET_KEY` | Clave secreta de Django | `cambia-esta-clave-en-produccion` |
| `DB_NAME` | Nombre de la base de datos | `ecommerce_db` |
| `DB_USER` | Usuario PostgreSQL | `postgres` |
| `DB_PASSWORD` | Contraseña PostgreSQL | - |
| `DB_HOST` | Host de la BD | `127.0.0.1` |
| `DB_PORT` | Puerto PostgreSQL | `5432` |
| `RECOVERY_CODE` | Código maestro de recuperación | - |
| `DEBUG` | Modo debug | `True` |

## Licencia

Proyecto universitario - Uso interno del negocio.
