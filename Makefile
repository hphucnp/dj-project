.PHONY: build up down restart logs clean migrate createsuperuser shell test

build:
	docker-compose build

up:
	docker-compose up -d

down:
	docker-compose down

restart:
	docker-compose restart

logs:
	docker-compose logs -f

logs-backend:
	docker-compose logs -f backend

logs-celery:
	docker-compose logs -f celery

logs-frontend:
	docker-compose logs -f frontend

clean:
	docker-compose down -v
	rm -rf backend/__pycache__
	rm -rf backend/*/__pycache__
	rm -rf frontend/node_modules
	rm -rf frontend/build

migrate:
	docker-compose exec backend python manage.py migrate

makemigrations:
	docker-compose exec backend python manage.py makemigrations

createsuperuser:
	docker-compose exec backend python manage.py createsuperuser

shell:
	docker-compose exec backend python manage.py shell

test-backend:
	docker-compose exec backend python manage.py test

test-frontend:
	docker-compose exec frontend npm test

collectstatic:
	docker-compose exec backend python manage.py collectstatic --noinput

ps:
	docker-compose ps

stop:
	docker-compose stop

start:
	docker-compose start
