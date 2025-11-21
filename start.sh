#!/bin/bash

echo "========================================"
echo "Todo App - Quick Start Script"
echo "========================================"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Error: Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if .env exists, if not copy from .env.example
if [ ! -f .env ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo "Done! You can edit .env if needed."
fi

echo "Building Docker images..."
docker compose build

echo ""
echo "Starting services..."
docker compose up -d

echo ""
echo "Waiting for services to be healthy..."
sleep 10

echo ""
echo "Running database migrations..."
docker compose exec -T backend python manage.py migrate

echo ""
echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo ""
echo "The application is now running:"
echo ""
echo "  Frontend:     http://localhost:3000"
echo "  Backend API:  http://localhost:8000/api"
echo "  Django Admin: http://localhost:8000/admin"
echo ""
echo "To create a superuser for Django admin:"
echo "  docker-compose exec backend python manage.py createsuperuser"
echo ""
echo "To view logs:"
echo "  docker-compose logs -f"
echo ""
echo "To stop the application:"
echo "  docker-compose down"
echo ""
echo "========================================"
