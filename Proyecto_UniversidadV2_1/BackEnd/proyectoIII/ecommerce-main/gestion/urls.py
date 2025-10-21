from django.urls import path
from . import views


urlpatterns = [
    path('admin_panel', views.admin_panel,name="admin_panel"),
    path('register', views.register_admin,name="register_admin"),
    path('logout_admin/', views.logout_admin, name='logout_admin'),
    path('login', views.login_admin,name="login_admin"),
    path('agg_users', views.agg_users,name="agg_users"),
    path('agg_products', views.agg_products,name="agg_products"),
    path('edit_users', views.edit_users,name="edit_users"),
    path('edit_products', views.edit_products,name="edit_products"),
   
]
