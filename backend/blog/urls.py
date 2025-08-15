from django.urls import path
from .views import BlogListCreate, BlogDelete

urlpatterns = [
    path('blog/', BlogListCreate.as_view(), name='blog-list'),
    path('blog/delete/<int:pk>/', BlogDelete.as_view(), name='delete-blog')
]