# api/serializers.py

from rest_framework import serializers
from .models import Category # ¡Importa el modelo desde tu app 'store'!

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'