from django.urls import path,include
from .views import *
from rest_framework import routers
router = routers.DefaultRouter()
router.register(r'categorias',Categorylist,'categorias')
router.register(r'productos',Productlist,'producto')
router.register(r'users',MostrarUsers,'users')
router.register(r'orders',MostrarOrder,'orders')


urlpatterns = [
    path('',include(router.urls)),
    path('admin/login/',AdminsLogin.as_view(), name='adminlogin'),
    path('admin/aggCategory/',AggCategorys.as_view(),name='aggCategory'),
    path('admin/aggProduct/',AggProduct.as_view(),name="aggProduct")
    #path('categorias/<slug:slug>/productos/', ProductByCategory, name='productos_por_categoria'),
   

   
]
