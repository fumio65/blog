from django.contrib import admin
from .models import Blog


class BlogAdmin(admin.ModelAdmin):
    list_display = ['title', 'created_at']
    list_filter = ['created_at']  # Add filter by date
    search_fields = ['title', 'content']  # Add search
    # ordering = ['-created_at']  # Order by newest first
    # date_hierarchy = 'created_at'  # Add date navigation

admin.site.register(Blog, BlogAdmin)