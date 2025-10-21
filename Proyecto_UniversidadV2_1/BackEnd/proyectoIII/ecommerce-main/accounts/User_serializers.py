from rest_framework import serializers
from .models import Account # ¡Importa el modelo desde tu app 'store'!

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = '__all__'

        