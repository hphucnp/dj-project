# Docker Compose Profiles Guide

This project now supports two development profiles:

## 🐳 **Full Profile** - Everything in Docker
All services (Django, Celery, PostgreSQL, Redis, Frontend) run in Docker containers.

## 🏠 **Local Profile** - Django runs locally
Only PostgreSQL and Redis run in Docker, Django runs on your local machine.

---

## Profile Configurations

### **Full Profile** (`full`)
- ✅ Django backend in Docker
- ✅ Celery worker in Docker  
- ✅ Celery beat in Docker
- ✅ PostgreSQL in Docker
- ✅ Redis in Docker
- ✅ Frontend in Docker

### **Local Profile** (`local`)
- ❌ Django backend runs locally
- ❌ Celery runs locally (optional)
- ✅ PostgreSQL in Docker
- ✅ Redis in Docker  
- ✅ Frontend in Docker

---

## Usage Commands

### **Full Profile** (Django in Docker)

```bash
# Start all services in Docker
docker-compose --profile full up

# Start in background
docker-compose --profile full up -d

# Build and start
docker-compose --profile full up --build

# Stop services
docker-compose --profile full down

# View logs
docker-compose --profile full logs -f backend
```

### **Local Profile** (Django runs locally)

```bash
# Start only database and Redis
docker-compose up

# Or explicitly specify local profile
docker-compose --profile local up

# In another terminal, run Django locally
cd backend
cp ../.env.local .env  # Use local environment config
poetry install
poetry run python manage.py migrate
poetry run python manage.py runserver

# Optional: Run Celery locally too
poetry run celery -A config worker --loglevel=info
poetry run celery -A config beat --loglevel=info
```

---

## Environment Files

### `.env.full` - For Docker profile
```bash
# Copy for full Docker setup
cp .env.full .env
docker-compose --profile full up
```

### `.env.local` - For local development  
```bash
# Copy for local development
cp .env.local backend/.env
# Then run Django locally
```

---

## Development Workflows

### **Full Docker Development** (Recommended for production-like testing)

```bash
# Setup
cp .env.full .env
docker-compose --profile full up --build

# Your Django app runs at: http://localhost:8000
# Frontend runs at: http://localhost:3000
# PostgreSQL: localhost:5432
# Redis: localhost:6379
```

**Pros:**
- ✅ Production-like environment
- ✅ Easy team setup
- ✅ No local Python environment needed
- ✅ Everything isolated

**Cons:**
- ❌ Slower code changes (rebuild needed)
- ❌ More resource intensive
- ❌ Harder debugging

### **Local Django Development** (Recommended for active development)

```bash
# Start infrastructure
docker-compose up -d  # Just DB and Redis

# Setup Django locally
cd backend
cp ../.env.local .env
poetry install
poetry run python manage.py migrate
poetry run python manage.py runserver

# Optional: Start Celery locally
poetry run celery -A config worker --loglevel=info
```

**Pros:**
- ✅ Faster development cycle
- ✅ Better debugging experience
- ✅ Direct access to Django shell
- ✅ Faster code reloading

**Cons:**
- ❌ Requires local Python/Poetry setup
- ❌ Environment differences

---

## Quick Start Commands

### **I want everything in Docker** (Full Profile)
```bash
cp .env.full .env
docker-compose --profile full up --build
```

### **I want to develop Django locally** (Local Profile)
```bash
# Terminal 1: Start infrastructure
docker-compose up -d

# Terminal 2: Run Django locally
cd backend
cp ../.env.local .env
poetry run python manage.py runserver
```

---

## Switching Between Profiles

### **From Local to Full**
```bash
# Stop local Django (Ctrl+C)
docker-compose down  # Stop DB/Redis if running
cp .env.full .env     # Switch environment
docker-compose --profile full up --build
```

### **From Full to Local**  
```bash
docker-compose --profile full down  # Stop all Docker services
docker-compose up -d                # Start just DB/Redis
cd backend
cp ../.env.local .env               # Switch environment  
poetry run python manage.py runserver
```

---

## Troubleshooting

### **Port conflicts**
```bash
# Check what's using ports
lsof -i :8000  # Django
lsof -i :5432  # PostgreSQL  
lsof -i :6379  # Redis
lsof -i :3000  # Frontend

# Stop conflicting services
docker-compose down
# Or kill specific processes
```

### **Database connection issues**
```bash
# For local profile, ensure DB is accessible
docker-compose up db redis -d

# Test connection
poetry run python manage.py dbshell
```

### **Environment variable issues**
```bash
# Make sure you're using the right .env file
# Local profile: backend/.env (copied from .env.local)
# Full profile: ./.env (copied from .env.full)
```

---

## File Structure

```
dj-project/
├── .env.full          # Environment for full Docker setup
├── .env.local         # Environment for local development
├── docker-compose.yml # With profiles configuration
├── backend/
│   ├── .env          # Copy from .env.local or .env.full
│   └── ...
└── frontend/
    └── ...
```

Choose the profile that best fits your current development needs!