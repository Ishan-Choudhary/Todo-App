from rest_framework import serializers

from .models import TodoList

class TodoListSerializer(serializers.ModelSerializer):
    UserID = serializers.ReadOnlyField(source="userID.id")
    class Meta:
        model = TodoList
        fields = ["id", "title", "description", "status", "UserID"]