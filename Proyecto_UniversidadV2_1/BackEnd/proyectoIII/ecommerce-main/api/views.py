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

#endpoint de productos
class Productlist(viewsets.ModelViewSet):
    queryset=Product.objects.all()
    serializer_class=ProductSerializer
    permission_classes = [AllowAny]  # Los productos deben ser públicos

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
        serializer = ProductSerializer(productos, many=True, context={'request': request})
        #devovlemos la respuesta al front
        return Response(serializer.data, status=status.HTTP_200_OK)
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
            
        product_name=request.data.get("product_name")
        slug=request.data.get("slug")
        description=request.data.get("description")
        price=request.data.get("price")
        images=request.FILES.get("images")
        stock=request.data.get("stock")
        category_id=request.data.get("category")
        category=Category.objects.get(id=category_id)

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
class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user
            print(f"🔍 Usuario autenticado: {user.email}")
            return Response({
                "id": user.id,
                "username": user.username,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
                "is_staff": user.is_staff,
                "is_admin": user.is_admin,
                "is_superadmin": user.is_superadmin,
            })
        except Exception as e:
            print(f"❌ Error en CurrentUserView: {e}")
            return Response({"error": str(e)}, status=500)


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
        from django.db.models import Q
        
        query = request.query_params.get('q', '')
        category_id = request.query_params.get('category', None)
        min_price = request.query_params.get('min_price', None)
        max_price = request.query_params.get('max_price', None)
        sort = request.query_params.get('sort', '-created_date')
        is_available = request.query_params.get('is_available', None)

        products = Product.objects.all()

        # Búsqueda por nombre o descripción
        if query:
            products = products.filter(
                Q(product_name__icontains=query) | 
                Q(description__icontains=query)
            )

        # Filtro por categoría
        if category_id:
            products = products.filter(category_id=category_id)

        # Filtro por rango de precio
        if min_price:
            products = products.filter(price__gte=min_price)
        if max_price:
            products = products.filter(price__lte=max_price)

        # Filtro por disponibilidad
        if is_available is not None:
            products = products.filter(is_available=is_available.lower() == 'true')

        # Ordenamiento
        if sort == 'price_asc':
            products = products.order_by('price')
        elif sort == 'price_desc':
            products = products.order_by('-price')
        elif sort == 'name':
            products = products.order_by('product_name')
        else:
            products = products.order_by('-created_date')

        serializer = ProductSerializer(products, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


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