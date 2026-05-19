# api/serializers.py

from rest_framework import serializers
from .models import Product, Variation, ReviewRating, ProductGallery

class ProductSerializer(serializers.ModelSerializer):
    average_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = '__all__'
    
    def get_average_rating(self, obj):
        return obj.averageReview()
    
    def get_review_count(self, obj):
        return obj.countReview()


class VariationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Variation
        fields = '__all__'


class ReviewRatingSerializer(serializers.ModelSerializer):
    user_username = serializers.SerializerMethodField()
    
    class Meta:
        model = ReviewRating
        fields = '__all__'
    
    def get_user_username(self, obj):
        return obj.user.username if obj.user else None


class ProductGallerySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductGallery
        fields = '__all__'


class ProductDetailSerializer(serializers.ModelSerializer):
    variations = serializers.SerializerMethodField()
    gallery = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()
    category_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = '__all__'
    
    def get_variations(self, obj):
        variations = Variation.objects.filter(product=obj, is_active=True)
        return VariationSerializer(variations, many=True).data
    
    def get_gallery(self, obj):
        gallery = ProductGallery.objects.filter(product=obj)
        return ProductGallerySerializer(gallery, many=True).data
    
    def get_average_rating(self, obj):
        return obj.averageReview()
    
    def get_review_count(self, obj):
        return obj.countReview()
    
    def get_category_name(self, obj):
        return obj.category.category_name if obj.category else None