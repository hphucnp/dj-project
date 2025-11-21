# Todo App - Full Stack Application

A full-stack todo application built with Django, React, PostgreSQL, Redis, Celery, and Docker.

## Features

- Full CRUD operations for todos
- Real-time status updates (Pending, In Progress, Completed)
- Priority levels for tasks
- Async task processing with Celery
- Modern React UI with responsive design
- RESTful API with Django REST Framework
- PostgreSQL database
- Redis for caching and Celery message broker
- Fully containerized with Docker

## Tech Stack

### Backend
- Django 4.2.7
- Django REST Framework
- PostgreSQL 15
- Redis 7
- Celery 5.3.4
- Gunicorn

### Frontend
- React 18.2
- Axios for API calls
- Modern CSS with gradient design

### DevOps
- Docker & Docker Compose
- Caddy 2 (modern web server with automatic HTTPS)

## Project Structure

```
dj-project/
├── backend/
│   ├── config/              # Django project settings
│   │   ├── __init__.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   ├── asgi.py
│   │   └── celery.py        # Celery configuration
│   ├── todos/               # Todo app
│   │   ├── models.py        # Todo model
│   │   ├── serializers.py   # DRF serializers
│   │   ├── views.py         # API views
│   │   ├── urls.py          # API routes
│   │   ├── tasks.py         # Celery tasks
│   │   ├── admin.py         # Django admin
│   │   └── tests.py         # Unit tests
│   ├── Dockerfile
│   ├── requirements.txt
│   └── manage.py
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── TodoList.js
│   │   │   ├── TodoItem.js
│   │   │   └── TodoForm.js
│   │   ├── services/
│   │   │   └── api.js       # API service layer
│   │   ├── styles/
│   │   │   └── App.css
│   │   ├── App.js
│   │   └── index.js
│   ├── Dockerfile
│   ├── Caddyfile
│   └── package.json
├── docker-compose.yml
├── .env
├── .env.example
├── Makefile
└── README.md
```

## Prerequisites

- Docker
- Docker Compose
- Make (optional, for using Makefile commands)

## Installation & Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd dj-project
```

### 2. Environment Configuration

Copy the example environment file and update it if needed:

```bash
cp .env.example .env
```

Edit `.env` with your preferred settings (optional for development).

### 3. Build and Run with Docker Compose

Build and start all services:

```bash
docker-compose build
docker-compose up -d
```

Or using Make:

```bash
make build
make up
```

### 4. Run Database Migrations

```bash
docker-compose exec backend python manage.py migrate
```

Or using Make:

```bash
make migrate
```

### 5. Create a Superuser (Optional)

To access the Django admin panel:

```bash
docker-compose exec backend python manage.py createsuperuser
```

Or using Make:

```bash
make createsuperuser
```

## Accessing the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api
- **Django Admin**: http://localhost:8000/admin

## API Endpoints

### Todos

- `GET /api/todos/` - List all todos (paginated)
- `POST /api/todos/` - Create a new todo
- `GET /api/todos/{id}/` - Retrieve a specific todo
- `PATCH /api/todos/{id}/` - Update a todo
- `DELETE /api/todos/{id}/` - Delete a todo
- `POST /api/todos/{id}/complete/` - Mark todo as completed
- `GET /api/todos/by_status/?status={status}` - Filter todos by status

### Example API Request

Create a todo:

```bash
curl -X POST http://localhost:8000/api/todos/ \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Learn Docker",
    "description": "Complete Docker tutorial",
    "status": "pending",
    "priority": 5
  }'
```

## Makefile Commands

The project includes a Makefile for common operations:

```bash
make build           # Build Docker images
make up              # Start all services
make down            # Stop all services
make restart         # Restart all services
make logs            # View logs from all services
make logs-backend    # View backend logs
make logs-celery     # View Celery logs
make logs-frontend   # View frontend logs
make migrate         # Run database migrations
make makemigrations  # Create new migrations
make createsuperuser # Create Django superuser
make shell           # Open Django shell
make test-backend    # Run backend tests
make clean           # Remove containers and volumes
make ps              # Show running containers
make stop            # Stop services without removing
make start           # Start stopped services
```

## Services

The application consists of 6 Docker services:

1. **db** - PostgreSQL 15 database
2. **redis** - Redis for caching and message broker
3. **backend** - Django REST API
4. **celery** - Celery worker for async tasks
5. **celery-beat** - Celery beat for periodic tasks
6. **frontend** - React application with Caddy 2 web server

## Development

### Backend Development

The backend code is mounted as a volume, so changes will be reflected immediately (with auto-reload).

Run tests:

```bash
make test-backend
```

Access Django shell:

```bash
make shell
```

### Frontend Development

For frontend development with hot reload, you can run the React dev server locally:

```bash
cd frontend
npm install
npm start
```

Then access the app at http://localhost:3000 (different from the Docker setup).

## Celery Tasks

The application includes example Celery tasks:

1. **send_todo_notification** - Sends notifications when todos are created/updated
2. **cleanup_old_todos** - Periodic task to clean up old completed todos

View Celery logs:

```bash
make logs-celery
```

## Database Schema

### Todo Model

| Field | Type | Description |
|-------|------|-------------|
| id | Integer | Primary key |
| title | CharField | Todo title (max 255 chars) |
| description | TextField | Optional description |
| status | CharField | pending/in_progress/completed |
| priority | Integer | Priority level (default: 0) |
| due_date | DateTimeField | Optional due date |
| created_at | DateTimeField | Auto-generated |
| updated_at | DateTimeField | Auto-updated |

## Troubleshooting

### Services won't start

Check logs:

```bash
make logs
```

### Database connection issues

Ensure PostgreSQL is healthy:

```bash
docker-compose ps
```

Recreate the database:

```bash
make clean
make build
make up
make migrate
```

### Port conflicts

If ports 3000, 8000, 5432, or 6379 are already in use, modify the port mappings in `docker-compose.yml`.

## Production Deployment

For production deployment:

1. Update the `.env` file with production values
2. Set `DEBUG=False` in settings
3. Use a strong `SECRET_KEY`
4. Configure proper `ALLOWED_HOSTS`
5. Set up HTTPS/SSL
6. Use environment-specific docker-compose files
7. Set up proper logging and monitoring
8. Use managed database services (RDS, etc.)
9. Configure Redis persistence

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on GitHub.
