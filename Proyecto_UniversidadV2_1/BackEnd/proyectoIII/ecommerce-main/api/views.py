from rest_framework import viewsets

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.permissions import AllowAny
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from django.utils.decorators import method_decorator

#JWT
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated


#models de las apps
from accounts.models import Account
from accounts.serializers import AdminsSerializer
from accounts.User_serializers import UserSerializer
from category.serializers import CategorySerializer
from store.models import Product, Variation, ReviewRating, ProductGallery
from store.serializers import ProductSerializer, VariationSerializer, ReviewRatingSerializer, ProductGallerySerializer, ProductDetailSerializer
from category.models import Category
from orders.models import Order
from orders.serializers import OrderSerializer



#endpoint de categorias
class Categorylist(viewsets.ModelViewSet):
    queryset=Category.objects.all()
    serializer_class=CategorySerializer
    permission_classes = [AllowAny]  # Las categorías deben ser públicas
    pagination_class = None

#endpoint de productos
@method_decorator(csrf_exempt, name='dispatch')
class Productlist(viewsets.ModelViewSet):
    queryset=Product.objects.all()
    serializer_class=ProductSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        from django.db.models import Q
        queryset = Product.objects.all()
        search = self.request.query_params.get('search', '')
        category = self.request.query_params.get('category', '')
        min_price = self.request.query_params.get('min_price', '')
        max_price = self.request.query_params.get('max_price', '')
        ordering = self.request.query_params.get('ordering', '-created_date')
        is_available = self.request.query_params.get('is_available', '')

        if search and len(search) >= 2:
            queryset = queryset.filter(
                Q(product_name__icontains=search) | Q(description__icontains=search)
            )
        if category:
            queryset = queryset.filter(category_id=category)
        if min_price:
            queryset = queryset.filter(price__gte=float(min_price))
        if max_price:
            queryset = queryset.filter(price__lte=float(max_price))
        if is_available in ('true', 'false'):
            queryset = queryset.filter(is_available=is_available == 'true')
        if ordering:
            queryset = queryset.order_by(ordering)

        return queryset

#productos por categorias
# Vista personalizada para obtener productos filtrados por categoría
# Usamos APIView para definir el comportamiento manualmente
class ProductByCategory(APIView):
    permission_classes = [AllowAny]  # Los productos por categoría deben ser públicos
    #consulta a la DB 
    queryset = Product.objects.all()

# Método GET → se ejecuta cuando el frontend hace una petición GET a la URL
#format=None → permite que la vista acepte distintos formatos (JSON, XML, etc.), aunque lo más común es JSON.
    def get (self,request,pk,format=None):
    
        try:
             # 🔍 Filtramos los productos por la categoría enviada en la URL
            # Usamos category_id=pk si el campo es ForeignKey
            productos=Product.objects.filter(category=pk)
            print(productos)
        except Exception as e:
            # ⚠️ Si ocurre algún error en la base de datos, devolvemos un mensaje controlado
            return Response(
                {"detail": "Error interno del servidor al consultar la base de datos."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            # 🧠 Serializamos los productos para convertirlos a formato JSON
        # Pasamos el 'request' en el contexto para que las URLs de imagen sean absolutas
        from rest_framework.pagination import PageNumberPagination
        paginator = PageNumberPagination()
        result_page = paginator.paginate_queryset(productos, request)
        serializer = ProductSerializer(result_page, many=True, context={'request': request})
        #devovlemos la respuesta al front
        return paginator.get_paginated_response(serializer.data)
    """
    many=True → indica que son varios productos (un queryset), no uno solo.
    context={'request': request} → se pasa para que, por ejemplo, los campos de imagen generen URLs completas.
    """

# mostrar usuarios 
class MostrarUsers(viewsets.ReadOnlyModelViewSet):
    queryset=Account.objects.all()
    serializer_class=AdminsSerializer
    permission_classes = [IsAuthenticated]  # Solo admins pueden ver usuarios

#muestra las categorias
class MostrarOrder(viewsets.ReadOnlyModelViewSet):
    queryset=Order.objects.all()
    serializer_class=OrderSerializer
    permission_classes = [IsAuthenticated]  # Solo usuarios autenticados pueden ver órdenes







#vista para iniciar sesion de administradores,
@method_decorator(csrf_exempt, name='dispatch')
class AdminsLogin(APIView):
    permission_classes = [AllowAny]

    def post(self, request):#se debe colocar como nombre de funcion el nombre del metodo correspondiente  
        email = request.data.get('email')
        password = request.data.get('password')

        user = authenticate(request, username=email, password=password)

        if user is not None:
            if user.is_staff:  
                return Response({
                    "message": "Bienvenido administrador",
                                # opcional
                    "user": {
                        "id": user.id,
                        "username": user.username,
                        "email": user.email,
                        "lastlogin":user.last_login,
                        "datajoinded":user.date_joinded,
                        "is_staff": user.is_staff,
                        "is_admin": user.is_admin
                    }
                }, status=200)
       
                
            else:
                return Response({"error": "Acceso solo para administradores"}, status=403)
        else:
            return Response({"error": "Credenciales inválidas"}, status=401)






@method_decorator(csrf_exempt, name='dispatch')
class AggCategorys(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self,request):
        if not request.user.is_staff:
            return Response({"error": "No autorizado"}, status=status.HTTP_403_FORBIDDEN)
            
        category_name=request.data.get("category_name")
        description=request.data.get("description")
        category_slug=request.data.get("slug")
        cat_image=request.FILES.get("cat_image")

        Category.objects.create(
            category_name=category_name,
            description=description,
            slug=category_slug,
            cat_image=cat_image

        )
        print(request.FILES)

        return Response({
            "message": "Haz Creado Con Exito la Categoria",
        })


@method_decorator(csrf_exempt, name='dispatch')
class AggProduct(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self,request):
        if not request.user.is_staff:
            return Response({"error": "No autorizado"}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            product_name=request.data.get("product_name")
            slug=request.data.get("slug")
            description=request.data.get("description")
            price=request.data.get("price")
            images=request.FILES.get("images")
            stock=request.data.get("stock")
            category_id=request.data.get("category")
            
            if not category_id:
                return Response({"error": "La categoría es requerida"}, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                category=Category.objects.get(id=category_id)
            except Category.DoesNotExist:
                return Response({"error": "La categoría no existe"}, status=status.HTTP_400_BAD_REQUEST)

            Product.objects.create(
                product_name=product_name,
                slug=slug,
                description=description,
                price=price,
                images=images,
                stock=stock,
                category=category
            )

            return Response({
                "message":"Producto creado con exito"
            })
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#edita las categorias
@method_decorator(csrf_exempt, name='dispatch')
class EditCategory(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if not self.request.user.is_staff:
            return Category.objects.none()
        return Category.objects.all()

@method_decorator(csrf_exempt, name='dispatch')
class DeleteCategory(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if not self.request.user.is_staff:
            return Category.objects.none()
        return Category.objects.all()



















#crear usuarios normales
@method_decorator(csrf_exempt, name='dispatch')
class Register_user(APIView):
    
    permission_classes = [AllowAny]
    #capturamos los datos
    def post(self,request):
        first_name=request.data.get("first_name")
        last_name=request.data.get("last_name")
        username=request.data.get("username")
        email=request.data.get("email")
        phone_number=request.data.get("phone_number")
        password=request.data.get("password")
        confirm_password=request.data.get("confirm_password")

        if not first_name or not last_name or not username or not email or not phone_number or not password or not confirm_password:
            return Response({"message": "Todos los campos son obligatorios"},status=status.HTTP_400_BAD_REQUEST)
        if password != confirm_password:
            return Response({"message": "Constraseñas no coinciden"},status=status.HTTP_400_BAD_REQUEST)
        if Account.objects.filter(email=email).exists():
            return Response({"message": "Email en Uso "},status=status.HTTP_400_BAD_REQUEST)
        
        user= Account.objects.create_user(
            first_name=first_name,
            last_name=last_name,
            username=username,
            email=email,
            password=password
        )
        user.phone_number = phone_number
        user.save()

        #creamos el tokken para el usuario
        refresh = RefreshToken.for_user(user)

        access_token = refresh.access_token

        return Response({
            "message": "Usuario registrado con éxito",
            "access": str(access_token),
            "refresh": str(refresh)
            }, status=status.HTTP_201_CREATED)


#devuelve los datos del usuario logueado.
@method_decorator(csrf_exempt, name='dispatch')
class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "username": user.username,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "phone_number": user.phone_number,
            "is_staff": user.is_staff,
            "is_admin": user.is_admin,
            "is_superadmin": user.is_superadmin,
        })

    def patch(self, request):
        user = request.user
        fields = ['first_name', 'last_name', 'email', 'phone_number']
        for field in fields:
            if field in request.data:
                setattr(user, field, request.data[field])
        user.save()

        from accounts.models import UserProfile
        profile, _ = UserProfile.objects.get_or_create(user=user)
        profile_fields = ['address_line_1', 'address_line_2', 'city', 'state', 'country']
        for field in profile_fields:
            if field in request.data:
                setattr(profile, field, request.data[field])
        if 'profile_picture' in request.FILES:
            profile.profile_picture = request.FILES['profile_picture']
        profile.save()

        return Response({
            "id": user.id,
            "username": user.username,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "phone_number": user.phone_number,
            "is_staff": user.is_staff,
        }, status=status.HTTP_200_OK)


import uuid
import random
import string

# Crear orden desde frontend
@method_decorator(csrf_exempt, name='dispatch')
class CreateOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def generate_order_number(self):
        return ''.join(random.choices(string.ascii_uppercase + string.digits, k=12))

    def post(self, request):
        try:
            from orders.serializers import CreateOrderSerializer
            from orders.models import Order, OrderProduct, Payment
            from store.models import Product

            print("=== USUARIO AUTENTICADO ===")
            print("User:", request.user)
            print("Auth:", request.auth)
            print("==========================")

            print("=== DATOS RECIBIDOS ===")
            print(request.data)
            print("========================")

            serializer = CreateOrderSerializer(data=request.data)
            if not serializer.is_valid():
                print("=== ERROR SERIALIZER ===")
                print(serializer.errors)
                print("===========================")
                return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

            data = serializer.validated_data
            print("=== DATA VALIDADA ===")
            print(data)
            print("======================")

            products_data = data.get('products_data', [])
            print("=== PRODUCTS DATA ===")
            print(products_data)
            print("=====================")

            if not products_data:
                return Response({"error": "No hay productos en el carrito"}, status=status.HTTP_400_BAD_REQUEST)

            subtotal = 0
            order_products = []

            for prod in products_data:
                prod_id = prod.get('id')
                if not prod_id:
                    continue
                try:
                    product = Product.objects.get(id=prod_id)
                except Product.DoesNotExist:
                    print(f"=== PRODUCTO NO ENCONTRADO: ID {prod_id} ===")
                    return Response({"error": f"Producto con ID {prod_id} no encontrado"}, status=status.HTTP_400_BAD_REQUEST)

                qty = prod.get('quantity', 1)
                subtotal += product.price * qty
                order_products.append({
                    'product': product,
                    'quantity': qty,
                    'price': product.price
                })

            print("=== ORDER PRODUCTS ===")
            print(order_products)
            print("======================")

            tax = subtotal * 0.16
            order_total = subtotal + tax

            payment = Payment.objects.create(
                user=request.user,
                payment_id=data.get('payment_id') or f"PAY-{uuid.uuid4().hex[:12].upper()}",
                payment_method=data.get('payment_method', 'simulated'),
                amount_id=str(order_total),
                status='Completed'
            )

            order = Order.objects.create(
                user=request.user,
                payment=payment,
                order_number=self.generate_order_number(),
                first_name=(data['first_name'][:50] if data['first_name'] else ''),
                last_name=(data['last_name'][:50] if data['last_name'] else ''),
                phone=(data['phone'][:50] if data['phone'] else ''),
                email=(data['email'][:50] if data['email'] else ''),
                address_line_1=(data['address_line_1'][:100] if data['address_line_1'] else ''),
                address_line_2=(data.get('address_line_2', '')[:100] if data.get('address_line_2') else ''),
                country=(data['country'][:50] if data['country'] else ''),
                city=(data['city'][:50] if data['city'] else ''),
                state=(data['state'][:50] if data['state'] else ''),
                order_note=(data.get('order_note', '')[:100] if data.get('order_note') else ''),
                order_total=order_total,
                tax=tax,
                status='New',
                is_ordered=True,
                ip=request.META.get('REMOTE_ADDR', '127.0.0.1')[:20]
            )

            for op in order_products:
                OrderProduct.objects.create(
                    order=order,
                    payment=payment,
                    user=request.user,
                    product=op['product'],
                    quantity=op['quantity'],
                    product_price=op['price'],
                    ordered=True
                )

            print("=== PEDIDO CREADO ===")
            print("Order ID:", order.id)
            print("Order Number:", order.order_number)
            print("==================")

            return Response({
                "success": True,
                "message": "Pedido creado con éxito",
                "order_id": order.id,
                "order_number": order.order_number,
                "order_total": float(order_total)
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            print("=== ERROR EN CREATE ORDER ===")
            print(str(e))
            import traceback
            traceback.print_exc()
            print("=============================")
            return Response({"error": f"Error interno: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Ver pedidos del usuario
class UserOrdersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        from orders.serializers import OrderSerializer
        from orders.models import Order

        orders = Order.objects.filter(user=request.user).order_by('-created_at')
        serializer = OrderSerializer(orders, many=True)
        
        return Response({
            "orders": serializer.data
        }, status=status.HTTP_200_OK)


# Ver todos los pedidos (para admin)
class AllOrdersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        from orders.serializers import OrderSerializer
        from orders.models import Order

        if not request.user.is_staff:
            return Response({"error": "No autorizado"}, status=status.HTTP_403_FORBIDDEN)

        orders = Order.objects.all().order_by('-created_at')
        serializer = OrderSerializer(orders, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


# Actualizar estado del pedido
@method_decorator(csrf_exempt, name='dispatch')
class UpdateOrderStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        from orders.models import Order

        if not request.user.is_staff:
            return Response({"error": "No autorizado"}, status=status.HTTP_403_FORBIDDEN)

        try:
            order = Order.objects.get(pk=pk)
        except Order.DoesNotExist:
            return Response({"error": "Pedido no encontrado"}, status=status.HTTP_404_NOT_FOUND)

        new_status = request.data.get('status')
        if new_status not in ['New', 'Accepted', 'Completed', 'Cancelled']:
            return Response({"error": "Estado inválido"}, status=status.HTTP_400_BAD_REQUEST)

        order.status = new_status
        order.save()

        return Response({
            "success": True,
            "message": f"Pedido {order.order_number} actualizado a {new_status}",
            "status": new_status
        }, status=status.HTTP_200_OK)


# Detalle de producto con variaciones y galería
class ProductDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk, format=None):
        try:
            product = Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            return Response({"detail": "Producto no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = ProductDetailSerializer(product, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


# Obtener reviews de un producto
class ProductReviewsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk, format=None):
        reviews = ReviewRating.objects.filter(product=pk, status=True).order_by('-created_at')
        serializer = ReviewRatingSerializer(reviews, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


# Crear review (solo usuarios autenticados)
@method_decorator(csrf_exempt, name='dispatch')
class CreateReviewView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk, format=None):
        try:
            product = Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            return Response({"detail": "Producto no encontrado"}, status=status.HTTP_404_NOT_FOUND)

        rating = request.data.get('rating')
        subject = request.data.get('subject', '')
        review = request.data.get('review', '')
        ip = request.META.get('REMOTE_ADDR', '127.0.0.1')

        if not rating:
            return Response({"error": "El rating es obligatorio"}, status=status.HTTP_400_BAD_REQUEST)

        # Verificar si el usuario ya hizo review de este producto
        existing_review = ReviewRating.objects.filter(product=product, user=request.user).first()
        
        if existing_review:
            # Actualizar review existente
            existing_review.rating = rating
            existing_review.subject = subject
            existing_review.review = review
            existing_review.ip = ip
            existing_review.save()
            return Response({"message": "Review actualizada correctamente"}, status=status.HTTP_200_OK)

        # Crear nueva review
        ReviewRating.objects.create(
            product=product,
            user=request.user,
            subject=subject,
            review=review,
            rating=rating,
            ip=ip,
            status=True
        )

        return Response({"message": "Review creada correctamente"}, status=status.HTTP_201_CREATED)


# Búsqueda avanzada de productos
class ProductSearchView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, format=None):
        from django.db.models import Q, Avg, F
        
        query = request.query_params.get('q', '')
        category_id = request.query_params.get('category', None)
        min_price = request.query_params.get('min_price', None)
        max_price = request.query_params.get('max_price', None)
        sort = request.query_params.get('sort', '-created_date')
        is_available = request.query_params.get('is_available', None)
        min_rating = request.query_params.get('min_rating', None)

        products = Product.objects.all()

        if query and len(query) >= 2:
            products = products.filter(
                Q(product_name__icontains=query) |
                Q(description__icontains=query)
            )

        if category_id:
            products = products.filter(category_id=int(category_id))

        if min_price:
            try:
                products = products.filter(price__gte=float(min_price))
            except ValueError:
                pass

        if max_price:
            try:
                products = products.filter(price__lte=float(max_price))
            except ValueError:
                pass

        if is_available in ('true', 'false'):
            products = products.filter(is_available=is_available == 'true')

        # Filtro por rating mínimo
        if min_rating:
            products = products.annotate(avg_rating=Avg('reviewrating__rating')).filter(avg_rating__gte=float(min_rating))

        # Ordenamiento
        if sort == 'price_asc':
            products = products.order_by('price')
        elif sort == 'price_desc':
            products = products.order_by('-price')
        elif sort == 'name':
            products = products.order_by('product_name')
        elif sort == 'rating':
            products = products.annotate(avg_rating=Avg('reviewrating__rating')).order_by(F('avg_rating').desc(nulls_last=True))
        else:
            products = products.order_by('-created_date')

        from rest_framework.pagination import PageNumberPagination
        paginator = PageNumberPagination()
        result_page = paginator.paginate_queryset(products, request)
        serializer = ProductSerializer(result_page, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)


# Productos relacionados (misma categoría)
class RelatedProductsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk, format=None):
        try:
            product = Product.objects.get(pk=pk)
            related = Product.objects.filter(category=product.category).exclude(pk=pk)[:4]
            serializer = ProductSerializer(related, many=True, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return Response({"detail": "Producto no encontrado"}, status=status.HTTP_404_NOT_FOUND)


from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str


# Recuperacion de contraseña - Solicitar reset
@method_decorator(csrf_exempt, name='dispatch')
class RequestPasswordResetView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({"detail": "El email es requerido"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = Account.objects.get(email=email)
        except Account.DoesNotExist:
            return Response({"detail": "Si el email existe, recibiras un enlace de recuperacion"}, status=status.HTTP_200_OK)

        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))

        reset_url = f"{request.build_absolute_uri('/')[:-1]}#/reset-password/{uid}/{token}"

        from django.core.mail import send_mail
        send_mail(
            subject="Recuperacion de contraseña - Tienda Salas Sanchez",
            message=f"Hola {user.first_name},\n\nPara restablecer tu contraseña, haz clic en el siguiente enlace:\n{reset_url}\n\nSi no solicitaste este cambio, ignora este mensaje.",
            from_email="noreply@tiendasalassanchez.com",
            recipient_list=[user.email],
            fail_silently=True,
        )

        return Response({
            "message": "Se ha enviado un enlace de recuperacion a tu correo electronico",
            "detail": "Se ha enviado un enlace de recuperacion a tu correo electronico"
        }, status=status.HTTP_200_OK)


# Recuperacion de contraseña - Confirmar reset
@method_decorator(csrf_exempt, name='dispatch')
class ConfirmPasswordResetView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        uidb64 = request.data.get('uidb64')
        token = request.data.get('token')
        new_password = request.data.get('password')

        if not uidb64 or not token or not new_password:
            return Response({"detail": "Todos los campos son requeridos"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = Account.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, Account.DoesNotExist):
            return Response({"detail": "Enlace invalido"}, status=status.HTTP_400_BAD_REQUEST)

        if not default_token_generator.check_token(user, token):
            return Response({"detail": "El enlace ha expirado o es invalido"}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()

        return Response({
            "message": "Contraseña restablecida exitosamente",
            "detail": "Contraseña restablecida exitosamente"
        }, status=status.HTTP_200_OK)


# Cambio de contraseña (usuario autenticado)
@method_decorator(csrf_exempt, name='dispatch')
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')

        if not current_password or not new_password:
            return Response({"detail": "Todos los campos son requeridos"}, status=status.HTTP_400_BAD_REQUEST)

        if not request.user.check_password(current_password):
            return Response({"detail": "La contrasena actual es incorrecta"}, status=status.HTTP_400_BAD_REQUEST)

        if len(new_password) < 8:
            return Response({"detail": "La contrasena debe tener al menos 8 caracteres"}, status=status.HTTP_400_BAD_REQUEST)

        request.user.set_password(new_password)
        request.user.save()

        return Response({"message": "Contrasena cambiada exitosamente"}, status=status.HTTP_200_OK)


# Carrito sincronizado con backend
@method_decorator(csrf_exempt, name='dispatch')
class UserCartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        from carts.models import Cart, CartItem
        cart, _ = Cart.objects.get_or_create(
            cart_id=f"cart_{request.user.id}"
        )
        items = CartItem.objects.filter(cart=cart, is_active=True).select_related('product')
        data = []
        for item in items:
            data.append({
                'id': item.product.id,
                'product_name': item.product.product_name,
                'price': float(item.product.price),
                'images': request.build_absolute_uri(item.product.images.url) if item.product.images else '',
                'quantity': item.quantity,
                'stock': item.product.stock,
                'is_available': item.product.is_available,
            })
        return Response({'cart_items': data}, status=status.HTTP_200_OK)

    def post(self, request):
        from carts.models import Cart, CartItem
        from store.models import Product

        cart, _ = Cart.objects.get_or_create(
            cart_id=f"cart_{request.user.id}"
        )
        CartItem.objects.filter(cart=cart).update(is_active=False)

        items_data = request.data.get('items', [])
        for item in items_data:
            try:
                product = Product.objects.get(id=item.get('id'), is_available=True)
            except Product.DoesNotExist:
                continue

            qty = max(1, min(int(item.get('quantity', 1)), product.stock))
            CartItem.objects.create(
                user=request.user,
                product=product,
                cart=cart,
                quantity=qty,
                is_active=True
            )

        return Response({'message': 'Carrito sincronizado'}, status=status.HTTP_200_OK)


# Tasa de cambio (Bs por USD)
class ExchangeRateView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        from store.models import ExchangeRate
        rate = ExchangeRate.objects.first()
        if not rate:
            rate = ExchangeRate.objects.create(rate=95.00, source='manual')
        return Response({
            'rate': float(rate.rate),
            'source': rate.source,
            'updated_at': rate.updated_at.isoformat() if rate.updated_at else None
        }, status=status.HTTP_200_OK)

    def post(self, request):
        if not request.user.is_authenticated or not request.user.is_staff:
            return Response({"error": "No autorizado"}, status=status.HTTP_403_FORBIDDEN)

        manual_rate = request.data.get('rate')
        if not manual_rate:
            return Response({"error": "La tasa es requerida"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            rate_value = float(manual_rate)
            if rate_value <= 0:
                raise ValueError
        except (ValueError, TypeError):
            return Response({"error": "Tasa invalida"}, status=status.HTTP_400_BAD_REQUEST)

        from store.models import ExchangeRate
        rate, _ = ExchangeRate.objects.get_or_create(pk=1)
        rate.rate = rate_value
        rate.source = 'manual'
        rate.save()

        return Response({
            'rate': float(rate.rate),
            'source': rate.source,
            'updated_at': rate.updated_at.isoformat()
        }, status=status.HTTP_200_OK)


class UpdateExchangeRateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if not request.user.is_staff:
            return Response({"error": "No autorizado"}, status=status.HTTP_403_FORBIDDEN)

        import requests as http_requests
        import logging
        logger = logging.getLogger(__name__)

        rate = None
        source_name = None
        errors = []

        apis = [
            {
                'url': 'https://ve.dolar-api.com/api/dolar/oficial',
                'name': 'DolarApi Venezuela',
                'parser': lambda data: float(data['price']) if 'price' in data and data.get('price') else None,
            },
            {
                'url': 'https://api.exchangemonitor.net/v1/rates?format=json',
                'name': 'Exchange Monitor',
                'parser': lambda data: float(data.get('dolar', {}).get('bcv')) if isinstance(data.get('dolar'), dict) else None,
            },
            {
                'url': 'https://exchangemonitor.net/api/v1/rates?format=json',
                'name': 'Exchange Monitor (alt)',
                'parser': lambda data: float(data.get('dolar', {}).get('bcv')) if isinstance(data.get('dolar'), dict) else None,
            },
            {
                'url': 'https://pydolarve.org/api/v1/BCV',
                'name': 'PyDolarVE',
                'parser': lambda data: float(data.get('rate')) if 'rate' in data else None,
            },
        ]

        for api in apis:
            try:
                resp = http_requests.get(api['url'], timeout=8, headers={'User-Agent': 'DjangoApp/1.0'})
                if resp.status_code == 200:
                    data = resp.json()
                    parsed = api['parser'](data)
                    if parsed and parsed > 0:
                        rate = parsed
                        source_name = api['name']
                        break
                    errors.append(f"{api['name']}: respuesta sin tasa valida ({resp.status_code})")
                else:
                    errors.append(f"{api['name']}: HTTP {resp.status_code}")
            except http_requests.exceptions.Timeout:
                errors.append(f"{api['name']}: timeout")
            except Exception as e:
                errors.append(f"{api['name']}: {str(e)[:80]}")
                continue

        if rate is None:
            fallback_apis = [
                {
                    'url': 'https://open.er-api.com/v6/latest/USD',
                    'name': 'Open Exchange Rates',
                    'parser': lambda data: float(data['rates']['VES']) if 'rates' in data and 'VES' in data['rates'] else None,
                },
                {
                    'url': 'https://api.exchangerate-api.com/v4/latest/USD',
                    'name': 'ExchangeRate-API',
                    'parser': lambda data: float(data['rates']['VES']) if 'rates' in data and 'VES' in data['rates'] else None,
                },
            ]
            for api in fallback_apis:
                try:
                    resp = http_requests.get(api['url'], timeout=8)
                    if resp.status_code == 200:
                        data = resp.json()
                        parsed = api['parser'](data)
                        if parsed and parsed > 0:
                            rate = parsed
                            source_name = f"{api['name']} (generico)"
                            break
                        errors.append(f"{api['name']}: sin VES en respuesta")
                    else:
                        errors.append(f"{api['name']}: HTTP {resp.status_code}")
                except Exception as e:
                    errors.append(f"{api['name']}: {str(e)[:80]}")
                    continue

        if rate is None:
            logger.warning(f"BCV auto-update failed. Errors: {'; '.join(errors)}")
            return Response(
                {
                    "error": "No se pudo obtener la tasa de cambio de ninguna fuente.",
                    "detail": "; ".join(errors[-3:]),
                },
                status=status.HTTP_502_BAD_GATEWAY
            )

        from store.models import ExchangeRate
        exchange, _ = ExchangeRate.objects.get_or_create(pk=1)
        exchange.rate = round(rate, 2)
        exchange.source = 'auto'
        exchange.save()

        logger.info(f"BCV rate updated to {exchange.rate} Bs/USD via {source_name}")

        return Response({
            'rate': float(exchange.rate),
            'source': exchange.source,
            'source_name': source_name,
            'updated_at': exchange.updated_at.isoformat()
        }, status=status.HTTP_200_OK)


# Recuperacion de administrador con codigo maestro
@method_decorator(csrf_exempt, name='dispatch')
class AdminRecoveryResetView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        recovery_code = request.data.get('recovery_code')
        new_password = request.data.get('new_password')

        if not email or not recovery_code or not new_password:
            return Response(
                {"detail": "Email, codigo de recuperacion y nueva contraseña son requeridos"},
                status=status.HTTP_400_BAD_REQUEST
            )

        from decouple import config as env_config
        master_code = env_config('RECOVERY_CODE', default='')

        if not master_code:
            return Response(
                {"detail": "El sistema no tiene configurado un codigo de recuperacion"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        if recovery_code != master_code:
            return Response(
                {"detail": "Codigo de recuperacion incorrecto"},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            user = Account.objects.get(email=email)
        except Account.DoesNotExist:
            return Response(
                {"detail": "No existe un usuario con ese email"},
                status=status.HTTP_404_NOT_FOUND
            )

        if not user.is_staff:
            return Response(
                {"detail": "Este usuario no tiene permisos de administrador"},
                status=status.HTTP_403_FORBIDDEN
            )

        if len(new_password) < 8:
            return Response(
                {"detail": "La contraseña debe tener al menos 8 caracteres"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(new_password)
        user.save()

        return Response({
            "message": f"Contraseña de {user.email} restablecida exitosamente"
        }, status=status.HTTP_200_OK)


# Productos mas vendidos
class TopProductsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        from orders.models import OrderProduct
        from django.db.models import Count, Sum

        top = OrderProduct.objects.filter(ordered=True).values(
            'product_id', 'product__product_name', 'product__price',
            'product__images', 'product__slug', 'product__stock', 'product__is_available'
        ).annotate(
            total_sold=Sum('quantity'),
            review_avg=Count('product__reviewrating__rating'),
            review_count=Count('product__reviewrating'),
        ).order_by('-total_sold')[:6]

        data = []
        for item in top:
            data.append({
                'id': item['product_id'],
                'product_name': item['product__product_name'],
                'price': float(item['product__price']),
                'images': request.build_absolute_uri(f"/media/{item['product__images']}") if item['product__images'] else '',
                'slug': item['product__slug'],
                'stock': item['product__stock'],
                'is_available': item['product__is_available'],
                'total_sold': item['total_sold'],
            })
        return Response(data, status=status.HTTP_200_OK)


# Reseñas publicas recientes
class PublicReviewsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        reviews = ReviewRating.objects.filter(status=True).select_related(
            'user', 'product'
        ).order_by('-created_at')[:6]
        data = []
        for r in reviews:
            data.append({
                'id': r.id,
                'user_name': f"{r.user.first_name} {r.user.last_name}",
                'user_initial': r.user.first_name[0] if r.user.first_name else 'U',
                'product_name': r.product.product_name,
                'rating': r.rating,
                'subject': r.subject,
                'review_text': r.review,
                'created_at': r.created_at.isoformat(),
            })
        return Response(data, status=status.HTTP_200_OK)


VALID_COUPONS = {
    'BIENVENIDO10': {'discount_amount': 10, 'label': '10% descuento'},
    'VERANO2026': {'discount_amount': 15, 'label': '15% descuento'},
    'SALAS20': {'discount_amount': 20, 'label': '20% descuento'},
}


class CouponValidateView(APIView):
    def post(self, request):
        code = (request.data.get('code') or '').strip().upper()
        if code in VALID_COUPONS:
            return Response(VALID_COUPONS[code], status=status.HTTP_200_OK)
        return Response({'error': 'Cupon no valido o expirado'}, status=status.HTTP_404_NOT_FOUND)