from django.shortcuts import render
from rest_framework import generics

from .models import TodoList
from .serializer import TodoListSerializer

# Create your views here.
class AddShowTodo(generics.ListCreateAPIView):
    serializer_class = TodoListSerializer

    def get_queryset(self):
        return TodoList.objects.filter(userID=self.request.user)

    def perform_create(self, serializer):
        serializer.save(userID=self.request.user, status=False)

class UpdateTodo(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TodoListSerializer
    lookup_field = "id"
    def get_queryset(self):
        return TodoList.objects.filter(userID=self.request.user)
