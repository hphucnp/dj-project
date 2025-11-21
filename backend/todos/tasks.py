from celery import shared_task
import time


@shared_task
def send_todo_notification(todo_id, action):
    """
    Simulated async task for sending notifications
    In a real app, this would send emails, push notifications, etc.
    """
    time.sleep(2)  # Simulate some processing time
    print(f"Notification sent for todo {todo_id}: {action}")
    return f"Notification sent for todo {todo_id}"


@shared_task
def cleanup_old_todos():
    """
    Example periodic task to cleanup old completed todos
    """
    from .models import Todo
    from datetime import timedelta
    from django.utils import timezone

    old_date = timezone.now() - timedelta(days=30)
    deleted_count = Todo.objects.filter(
        status='completed',
        updated_at__lt=old_date
    ).delete()[0]

    return f"Deleted {deleted_count} old todos"
