# api/serializers.py

from rest_framework import serializers
from .models import Order # ¡Importa el modelo desde tu app 'store'!

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'