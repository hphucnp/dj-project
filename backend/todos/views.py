from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Todo
from .serializers import TodoSerializer
from .tasks import send_todo_notification


class TodoViewSet(viewsets.ModelViewSet):
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer

    def perform_create(self, serializer):
        todo = serializer.save()
        # Trigger async task for notification
        send_todo_notification.delay(todo.id, 'created')

    def perform_update(self, serializer):
        todo = serializer.save()
        # Trigger async task for notification
        send_todo_notification.delay(todo.id, 'updated')

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        todo = self.get_object()
        todo.status = 'completed'
        todo.save()
        send_todo_notification.delay(todo.id, 'completed')
        return Response({'status': 'todo completed'})

    @action(detail=False, methods=['get'])
    def by_status(self, request):
        status_param = request.query_params.get('status', None)
        if status_param:
            todos = self.queryset.filter(status=status_param)
            serializer = self.get_serializer(todos, many=True)
            return Response(serializer.data)
        return Response({'error': 'Status parameter required'}, status=status.HTTP_400_BAD_REQUEST)
