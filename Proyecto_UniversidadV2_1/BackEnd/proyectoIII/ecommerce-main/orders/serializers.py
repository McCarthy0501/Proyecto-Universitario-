# api/serializers.py

from rest_framework import serializers
from .models import Order, OrderProduct, Payment
from store.models import Product

class ProductSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'product_name', 'price', 'images']


class OrderProductSerializer(serializers.ModelSerializer):
    product = ProductSimpleSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = OrderProduct
        fields = ['id', 'product', 'product_id', 'quantity', 'product_price', 'ordered', 'created_at']


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):
    orderproduct_set = OrderProductSerializer(many=True, read_only=True)
    
    class Meta:
        model = Order
        fields = '__all__'


class CreateOrderSerializer(serializers.Serializer):
    first_name = serializers.CharField(max_length=50)
    last_name = serializers.CharField(max_length=50)
    phone = serializers.CharField(max_length=50)
    email = serializers.EmailField()
    address_line_1 = serializers.CharField(max_length=100)
    address_line_2 = serializers.CharField(max_length=100, required=False, allow_blank=True)
    country = serializers.CharField(max_length=50)
    city = serializers.CharField(max_length=50)
    state = serializers.CharField(max_length=50)
    order_note = serializers.CharField(max_length=100, required=False, allow_blank=True)

    payment_method = serializers.CharField(max_length=100, default='simulated', required=False)
    payment_id = serializers.CharField(max_length=100, required=False, allow_blank=True)

    products_data = serializers.ListField(child=serializers.DictField(), required=False)