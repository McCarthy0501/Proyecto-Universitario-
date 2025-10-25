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
from store.models import Product
from store.serializers import ProductSerializer
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
    permission_classes = [AllowAny]
    def post(self,request):
        category_name=request.data.get("category_name")
        descritption=request.data.get("description")
        category_slug=request.data.get("slug")
        cat_image=request.FILES.get("cat_image")

        Category.objects.create(
            category_name=category_name,
            description=descritption,
            slug=category_slug,
            cat_image=cat_image

        )
        print(request.FILES) #aqui verifico si se envio el archivo

        return Response({
            "message": "Haz Creado Con Exito la Categoria",
          

        
          
        })


@method_decorator(csrf_exempt, name='dispatch')
class AggProduct(APIView):
    permission_classes = [AllowAny]
    def post(self,request):
        permission_classes = [AllowAny]
        #capturamos los datos
        product_name=request.data.get("product_name")
        slug=request.data.get("slug")
        description=request.data.get("description")
        price=request.data.get("price")
        images=request.FILES.get("images")
        stock=request.data.get("stock")
        category_id=request.data.get("category") #capturo el valor  de  la categoria
        category=Category.objects.get(id=category_id) #obtengo la id de la categoria para inyectarla

        

        Product.objects.create(
            product_name=product_name,
            slug=slug,
            description=description,
            price=price,
            images=images,
            stock=stock,
            category=category


        )
        print(request.FILES)

        return Response({
            "message":"Producto creado con exito"
        })

#edita las categorias
@method_decorator(csrf_exempt, name='dispatch')
class EditCategory(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

@method_decorator(csrf_exempt, name='dispatch')
class DeleteCategory(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]



















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
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
            })
        except Exception as e:
            print(f"❌ Error en CurrentUserView: {e}")
            return Response({"error": str(e)}, status=500)