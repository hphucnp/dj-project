from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Todo


class TodoModelTest(TestCase):
    def setUp(self):
        self.todo = Todo.objects.create(
            title="Test Todo",
            description="Test Description",
            status="pending"
        )

    def test_todo_creation(self):
        self.assertEqual(self.todo.title, "Test Todo")
        self.assertEqual(self.todo.status, "pending")


class TodoAPITest(APITestCase):
    def setUp(self):
        self.todo = Todo.objects.create(
            title="Test Todo",
            description="Test Description",
            status="pending"
        )

    def test_get_todos(self):
        response = self.client.get('/api/todos/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_todo(self):
        data = {
            'title': 'New Todo',
            'description': 'New Description',
            'status': 'pending'
        }
        response = self.client.post('/api/todos/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_update_todo(self):
        data = {'title': 'Updated Todo'}
        response = self.client.patch(f'/api/todos/{self.todo.id}/', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Updated Todo')

    def test_delete_todo(self):
        response = self.client.delete(f'/api/todos/{self.todo.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
