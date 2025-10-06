from django.shortcuts import render,redirect, get_object_or_404
from django.http import HttpResponse
from accounts.models	import Account
from category.models	import Category
from store.models		import Product,Variation
from orders.models		import Order,OrderProduct
from django.contrib import messages, auth
from django.contrib.auth.decorators import login_required
from django.utils.text import slugify # Importa slugify


# Create your views here.

def register_admin(request):
	if request.method == "POST":
		email=request.POST.get('email')
		username=request.POST.get('username')
		first_name=request.POST.get('first_name')
		last_name=request.POST.get('last_name')
		password=request.POST.get('password')

		try:
			Account.objects.create_superuser(
				email=email,
				username=username,
				password=password,
				first_name=first_name,
				last_name=last_name)
			messages.success(request, 'Has Creado un Nuevo Administrador')

			return render(request,'admin/gestion_register.html')
		except ValueError as e:
			error = str(e)
			return render(request, 'admin/gestion_register.html', {'error': error})
	return render(request, 'admin/gestion_register.html')


def login_admin(request):
	if request.method == 'POST':
		email = request.POST.get('email')
		password = request.POST.get('password')
		user = auth.authenticate(request, email=email, password=password)
		if user is not None:
			auth.login(request, user)
			messages.success(request, 'Has iniciado sesión exitosamente.')
			return redirect('admin_panel')
		else:
			messages.error(request, 'Correo electrónico o contraseña incorrectos.')
			return redirect('login_admin')
	return render(request, 'admin/gestion_login.html')

@login_required(login_url='login_admin') 
def logout_admin(request):
    auth.logout(request)
    messages.success(request, 'Has Cerrado Sesión')

    return redirect('login_admin')

@login_required(login_url='login_admin')
def admin_panel(request):
	#llamamos a la db los datos que necesitamos
	usuarios=Account.objects.all()
	productos=Product.objects.all()
	ordenes=Order.objects.all()
	#llamamos a la db los totales de cada tabla
	total_usuarios = Account.objects.all().count()
	total_productos = Product.objects.all().count()
	total_ordenes= Order.objects.all().count()
	#hacemos un diccionario para almecenar las consultas
	context={
    	'total_usuarios':total_usuarios,
    	'total_productos':total_productos,
    	'total_ordenes':total_ordenes,
    	'usuarios':usuarios,
    	'productos':productos,
    	'ordenes':ordenes
    }
	return render(request,'admin/gestion.html',context)


@login_required(login_url='login_admin')
def agg_users(request):
	usuarios=Account.objects.all()
	return render(request,'admin/users/agg_users.html')

@login_required(login_url='login_admin')
def agg_products(request):
	#llamamos los datos de la db
	productos=Product.objects.all()
	categoria=Category.objects.all()

	#creamos un diccionario con los datos obtenidos de la db
	contex={'productos':productos,
	'categoria':categoria
	}

	if request.method == "POST":
		product_name=request.POST.get('product_name')
		slung=request.POST.get('slung')
		category=request.POST.get('category')
		price=request.POST.get('price')
		stock=request.POST.get('stock')
		images=request.FILES.get('images')
		description=request.POST.get('description')

		try:
			#obtenemos la ID de la categoria
			category_id=Category.objects.get(id=category)
			#hacemos el slug automatico basandonos en el nombre del producto
			generated_slug = slugify(product_name)
			slug_count = 1
			while Product.objects.filter(slug=generated_slug).exists():
				generated_slug = f'{slugify(product_name)}-{slug_count}'
				slug_count += 1
			#creamos el producto	
			Product.objects.create(
				product_name=product_name,
				slug=generated_slug,
				category=category_id,
				price=int(price),
				stock=int(stock),
				images=images,
				description=description)
			print("felicidades")
			messages.success(request, 'Has Creado un Nuevo Producto')
			return redirect('agg_products')
		except ValueError as r:
			error= str(r)
			print("error")
			return render(request,'admin/products/agg_products.html',contex)
	return render(request,'admin/products/agg_products.html',contex)






@login_required(login_url='login_admin')
def edit_users(request):
	usuarios=Account.objects.all()
	return render(request,'admin/users/edit_users.html')

@login_required(login_url='login_admin')
def edit_products(request):
	productos=Product.objects.all()
	return render(request,'admin/products/edit_products.html')