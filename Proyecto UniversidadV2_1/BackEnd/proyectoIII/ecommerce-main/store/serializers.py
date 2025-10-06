# api/serializers.py

from rest_framework import serializers
from .models import Product # ¡Importa el modelo desde tu app 'store'!

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'