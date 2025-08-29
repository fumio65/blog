from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Blog
from .serializers import BlogSerializer, BlogCreateSerializer

class BlogViewSet(viewsets.ModelViewSet):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action"""
        if self.action in ['create', 'update', 'partial_update']:
            return BlogCreateSerializer
        return BlogSerializer
    
    def perform_create(self, serializer):
        """Automatically set the author to the current user when creating a blog"""
        serializer.save(author=self.request.user)
    
    def get_queryset(self):
        """Optimize queries by selecting related author data"""
        return Blog.objects.select_related('author').all()
    
    @action(detail=False, methods=['get'])
    def my_blogs(self, request):
        """Get blogs created by the current user"""
        if not request.user.is_authenticated:
            return Response({'detail': 'Authentication required'}, status=401)
        
        blogs = Blog.objects.filter(author=request.user).select_related('author')
        serializer = self.get_serializer(blogs, many=True)
        return Response(serializer.data)
