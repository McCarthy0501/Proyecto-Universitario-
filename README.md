# 🛒 Salas Sanchez - Tienda Virtual

<p align="center">
  <img src="https://via.placeholder.com/300x100/2563eb/ffffff?text=Salas+Sanchez" alt="Salas Sanchez Logo">
</p>

<p align="center">
  <strong>E-commerce completo desarrollado con Django + React</strong><br>
  Tu tienda online para ventas de productos con gestión de inventario, carritos de compra y panel de administración.
</p>

---

## 🚀Características Principales

### Para Clientes
- ✅ Navegación por categorías
- ✅ Buscador de productos en tiempo real
- ✅ Carrito de compras interactivo
- ✅ Proceso de checkout multi-paso
- ✅ Sistema de pago simulado
- ✅ Cuenta de usuario con historial de pedidos
- ✅ Reseñas y calificaciones de productos

### Para Administradores
- ✅ Panel admin moderno (React)
- ✅ Gestión de productos (agregar/editar/eliminar)
- ✅ Gestión de categorías
- ✅ Gestión de pedidos en tiempo real
- ✅ Estados de pedido: Pendiente → Aceptado → Completado
- ✅ Estadísticas de ventas

---

## 🛠️ Tecnologías

| Frontend | Backend | Base de Datos |
|----------|---------|---------------|
| React + Vite | Django 4.2 | PostgreSQL |
| TailwindCSS | Django REST Framework | |
| Framer Motion | JWT Auth | |
| Lucide Icons | SimpleJWT | |

---

## 📋 Requisitos Previos

- **Node.js** 18+
- **Python** 3.8+
- **PostgreSQL** 14+

---

## ⚡ Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/Proyecto-Universitario-.git
cd Proyecto-Universitario-
```

### 2. Configurar el Backend (Django)

```bash
# Entrar a la carpeta del backend
cd BackEnd/proyectoIII/ecommerce-main

# Crear entorno virtual
python -m venv env

# Activar entorno virtual
# Linux/Mac:
source env/bin/activate
# Windows:
env\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt
```

### 3. Configurar Base de Datos

```bash
# Crear la base de datos en PostgreSQL
createdb ecommerce_db

# Configurar credenciales en ecommerce/settings.py
# o crear archivo .env:
DATABASE_NAME=ecommerce_db
DATABASE_USER=postgres
DATABASE_PASSWORD=tu_password
```

### 4. Migraciones

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
```

### 5. Iniciar Servidor Backend

```bash
python manage.py runserver
# Servidor disponible en http://localhost:8000
```

---

### 6. Configurar Frontend (React)

```bash
# Nueva terminal
cd tienda_salas_sanchez

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
# Frontend disponible en http://localhost:5173
```

---

## 📱 Uso de la Aplicación

### Acceso Cliente
1. Regístrate en `/register`
2. Inicia sesión en `/login`
3. Explora productos y agrega al carrito
4. Finaliza la compra en `/cart`

### Acceso Administrador
1. Accede a `/admin`
2. Usa las credenciales de superusuario
3. Gestiona productos, categorías y pedidos

---

## 🌐 Endpoints API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/categorias/` | Listar categorías |
| GET | `/api/productos/` | Listar productos |
| POST | `/api/orders/create/` | Crear orden |
| GET | `/api/orders/` | Ver todos los pedidos (admin) |
| PATCH | `/api/orders/{id}/` | Actualizar estado |
| POST | `/api/token/` | Obtener token JWT |

---

## 📁 Estructura del Proyecto

```
Proyecto-Universitario-/
├── BackEnd/
│   └── proyectoIII/
│       └── ecommerce-main/
│           ├── api/           # Endpoints REST
│           ├── store/         # Productos
│           ├── orders/        # Pedidos
│           ├── carts/         # Carritos
│           ├── accounts/     # Usuarios
│           └── category/     # Categorías
│
├── tienda_salas_sanchez/
│   ├── src/
│   │   ├── components/   # Componentes React
│   │   ├── pages/       # Páginas
│   │   ├── contexts/    # Contextos (Auth, Cart)
│   │   └── api/         # Llamadas API
│   └── public/
│
└── README.md
```

---

## 🎨 Capturas de Pantalla

<p align="center">
  <img src="https://via.placeholder.com/600x400/1e293b/ffffff?text=Tienda+Online" alt="Tienda">
</p>

---

## 🔧 Variables de Entorno

### Backend (.env)
```env
SECRET_KEY=tu_secret_key
DATABASE_NAME=ecommerce_db
DATABASE_USER=postgres
DATABASE_PASSWORD=tu_password
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

---




<p align="center">
  <strong>Desarrollado con ❤️ por el equipo de Salas Sanchez</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Django-4.2+-092E20?style=for-the-badge&logo=django" alt="Django">
  <img src="https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/PostgreSQL-14+-336791?style=for-the-badge&logo=postgresql" alt="PostgreSQL">
</p>