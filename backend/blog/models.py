from django.db import models

class Blog(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey('user.User', on_delete=models.CASCADE, related_name='blogs')

    class Meta:
        ordering = ['-created_at']


    def __str__(self):
        return self.title