from django.urls import path
from . import views

urlpatterns = [
    path("todos/", views.AddShowTodo.as_view()),
    path("todos/<int:id>", views.UpdateTodo.as_view())
]