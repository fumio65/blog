from rest_framework import serializers
from .models import Blog
from user.serializers import UserSerializer


class BlogSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()
    author_details = UserSerializer(source='author', read_only=True)
    
    class Meta:
        model = Blog
        fields = ['id', 'title', 'content', 'created_at', 'author', 'author_name', 'author_details']
        read_only_fields = ['created_at']

    def get_author_name(self, obj):
        """Return the username of the author"""
        if obj.author:
            return obj.author.username
        return None

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


class BlogCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating blogs - excludes author details"""
    
    class Meta:
        model = Blog
        fields = ['title', 'content']
        
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