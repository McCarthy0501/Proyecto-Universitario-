from rest_framework import viewsets
from store.models import Product
from store.serializers import ProductSerializer
from category.models import Category

from category.serializers import CategorySerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.permissions import AllowAny
from accounts.models import Account
from accounts.serializers import AdminsSerializer
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from django.utils.decorators import method_decorator


#endpoint de categorias
class Categorylist(viewsets.ModelViewSet):
    queryset=Category.objects.all()
    serializer_class=CategorySerializer

#endpoint de productos
class Productlist(viewsets.ModelViewSet):
    queryset=Product.objects.all()
    serializer_class=ProductSerializer

#en construccion    
class ProductByCategory(viewsets.ReadOnlyModelViewSet):
    serializer_class=ProductSerializer
    def get_queryset(self):
        slug = self.kwargs['slug']  # Obtenemos el slug de la URL
        return Product.objects.filter(category__slug=slug) 



# mostrar usuarios 
class MostrarUsers(viewsets.ReadOnlyModelViewSet):
    queryset=Account.objects.all()
    serializer_class=AdminsSerializer









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

