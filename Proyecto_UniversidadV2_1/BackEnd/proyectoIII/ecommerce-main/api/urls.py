from django.urls import path,include
from .views import *
from rest_framework import routers
router = routers.DefaultRouter()
router.register(r'categorias',Categorylist,'categorias')
router.register(r'productos',Productlist,'producto')
router.register(r'users',MostrarUsers,'users')
router.register(r'orders',MostrarOrder,'orders')

router.register(r'edit_categorias', EditCategory, basename='edit_categorias')
router.register(r'delete_categorias', DeleteCategory, basename='delete_categorias')

urlpatterns = [
    path('',include(router.urls)),
    path('admin/login/',AdminsLogin.as_view(), name='adminlogin'),
    path('admin/aggCategory/',AggCategorys.as_view(),name='aggCategory'),
    path('admin/aggProduct/',AggProduct.as_view(),name="aggProduct"),
    path('register_user/',Register_user.as_view(),name="register_user"),
    path('productosPorCategorias/<int:pk>/',ProductByCategory.as_view(),name="productosPorCategorias")
   

   
]
