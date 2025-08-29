from django.contrib import admin
from .models import Blog


class BlogAdmin(admin.ModelAdmin):
    list_display = ['title', 'get_author_name', 'created_at']
    list_filter = ['created_at', 'author']  # Add filter by date and author
    search_fields = ['title', 'content', 'author__first_name', 'author__last_name']  # Add search including author names
    ordering = ['-created_at']  # Order by newest first
    date_hierarchy = 'created_at'  # Add date navigation
    
    def get_author_name(self, obj):
        """Display author's full name in admin list"""
        if obj.author:
            return f"{obj.author.first_name} {obj.author.last_name}"
        return "No Author"
    get_author_name.short_description = 'Author'
    get_author_name.admin_order_field = 'author__first_name'  # Allow sorting by author name

admin.site.register(Blog, BlogAdmin)