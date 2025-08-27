from rest_framework import serializers
from .models import Blog


class BlogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blog
        fields = '__all__'


    def validate_title(self, value):
        if len(value) == 0:
            raise serializers.ValidationError('Title is required.')
        if len(value) < 5:
            raise serializers.ValidationError('Title must be at least 5 characters long.')
        if len(value) > 100:
            raise serializers.ValidationError('Title must be less than 100 characters long.')
        return value
    
    def validate_content(self, value):
        if len(value) == 0:
            raise serializers.ValidationError('Content is required.')
        if len(value) < 10:
            raise serializers.ValidationError('Content must be at least 10 characters long.')
        return value