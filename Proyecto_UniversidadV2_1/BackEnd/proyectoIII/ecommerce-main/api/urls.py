from django.urls import path,include
from .views import *
from rest_framework import routers
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.response import Response

router = routers.DefaultRouter()
router.register(r'categorias',Categorylist,'categorias')
router.register(r'productos',Productlist,'producto')
router.register(r'users',MostrarUsers,'users')

router.register(r'edit_categorias', EditCategory, basename='edit_categorias')
router.register(r'delete_categorias', DeleteCategory, basename='delete_categorias')

urlpatterns = [
    path('productos/buscar/', ProductSearchView.as_view(), name='product_search'),
    path('productos/top/', TopProductsView.as_view(), name='top_products'),
    path('',include(router.urls)),
    path('admin/login/',AdminsLogin.as_view(), name='adminlogin'),
    path('admin/aggCategory/',AggCategorys.as_view(),name='aggCategory'),
    path('admin/aggProduct/',AggProduct.as_view(),name="aggProduct"),
    path('register_user/',Register_user.as_view(),name="register_user"),
    path('productosPorCategorias/<int:pk>/',ProductByCategory.as_view(),name="productosPorCategorias"),
    path('user/me/', CurrentUserView.as_view(), name='current_user'),
    path('orders/', AllOrdersView.as_view(), name='all_orders'),
    path('orders/create/', CreateOrderView.as_view(), name='create_order'),
    path('orders/<int:pk>/', UpdateOrderStatusView.as_view(), name='update_order_status'),
    path('orders/my-orders/', UserOrdersView.as_view(), name='user_orders'),
    path('test/', lambda request: Response({"message": "API funcionando correctamente"}), name='test_api'),
    
    # Nuevos endpoints
    path('productos/<int:pk>/detalle/', ProductDetailView.as_view(), name='product_detail'),
    path('productos/<int:pk>/reviews/', ProductReviewsView.as_view(), name='product_reviews'),
    path('productos/<int:pk>/crear-review/', CreateReviewView.as_view(), name='create_review'),
    path('productos/<int:pk>/relacionados/', RelatedProductsView.as_view(), name='related_products'),
    path('password-reset/', RequestPasswordResetView.as_view(), name='request_password_reset'),
    path('password-reset/confirm/', ConfirmPasswordResetView.as_view(), name='confirm_password_reset'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('cart/', UserCartView.as_view(), name='user_cart'),
    path('admin/recovery-reset/', AdminRecoveryResetView.as_view(), name='admin_recovery_reset'),
    path('config/exchange-rate/', ExchangeRateView.as_view(), name='exchange_rate'),
    path('config/exchange-rate/update/', UpdateExchangeRateView.as_view(), name='update_exchange_rate'),
    path('reviews/ultimas/', PublicReviewsView.as_view(), name='public_reviews'),
    path('coupons/validate/', CouponValidateView.as_view(), name='validate_coupon'),
]

urlpatterns += [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),   # login JWT
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # refresco JWT
]