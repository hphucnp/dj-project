# Django 5 Upgrade Guide

Your Django project has been updated to use Django 5.1! Here's what changed and what you need to know.

## Changes Made

### Dependencies Updated in `pyproject.toml`:
- **Django**: `^4.2.7` → `^5.1.0`
- **Django REST Framework**: `^3.14.0` → `^3.15.2`
- **django-cors-headers**: `^4.3.0` → `^4.4.0`
- **Redis**: `^5.0.1` → `^5.1.1`
- **Gunicorn**: `^21.2.0` → `^23.0.0`
- **Python requirement**: `^3.8` → `^3.10` (Django 5 requires Python 3.10+)

### Docker Updates:
- **Base image**: `python:3.11-slim` → `python:3.12-slim`

## What's New in Django 5

### Key Features:
1. **Simplified syntax for field lookups**: More readable query syntax
2. **Facet filters for the admin**: Enhanced admin interface filtering
3. **Simplified templates for form rendering**: Better form handling
4. **Database-computed default values**: More efficient defaults
5. **More options for declaring field choices**: Improved field definitions
6. **Psychopg 3 support**: Better PostgreSQL integration

### Breaking Changes to Be Aware Of:

1. **Python 3.10+ Required**: Ensure your environment supports Python 3.10 or higher
2. **Deprecated features removed**: Some Django 4.x deprecated features are gone
3. **Admin interface changes**: Some admin customizations might need updates

## Upgrade Steps

### 1. Update Dependencies
```bash
cd backend
poetry update
```

### 2. Run System Checks
```bash
poetry run python manage.py check
```

### 3. Create and Run Migrations
```bash
poetry run python manage.py makemigrations
poetry run python manage.py migrate
```

### 4. Test Your Application
```bash
# Run tests
poetry run python manage.py test

# Or with pytest
poetry run pytest

# Start development server
poetry run python manage.py runserver
```

### 5. Docker Build and Test
```bash
# Rebuild with new dependencies
docker-compose build --no-cache

# Start services
docker-compose up
```

## Potential Issues and Solutions

### 1. Import Errors
If you see import errors, check for deprecated imports:
```python
# Old (deprecated)
from django.utils.translation import ugettext_lazy as _

# New
from django.utils.translation import gettext_lazy as _
```

### 2. Admin Interface
If you have custom admin classes, test them thoroughly as Django 5 has admin improvements.

### 3. Form Rendering
Django 5 has new form rendering options. Your existing forms should work, but you can now use:
```python
# New simplified form rendering
{{ form.as_div }}  # Instead of as_p or as_table
```

### 4. Database Compatibility
Your PostgreSQL setup should work fine. Django 5 supports PostgreSQL 12+.

## Performance Improvements

Django 5 includes several performance improvements:
- Faster template rendering
- Improved ORM query optimization
- Better caching mechanisms
- Enhanced admin interface performance

## Security Enhancements

- Updated security middleware
- Enhanced CSRF protection
- Better password validation
- Improved user session management

## Testing Your Upgrade

Run these commands to verify everything works:

```bash
# Check for any issues
poetry run python manage.py check --deploy

# Validate models
poetry run python manage.py validate

# Run full test suite
poetry run python manage.py test

# Check for any deprecated usage
poetry run python -Wd manage.py check
```

## Rollback Plan (if needed)

If you encounter issues, you can rollback by:

1. Reverting the `pyproject.toml` changes
2. Running `poetry update` to downgrade
3. Reverting the Dockerfile Python version

## Next Steps

1. **Test thoroughly**: Especially user authentication, API endpoints, and admin interface
2. **Update documentation**: Reflect Django 5 usage in your project docs
3. **Monitor performance**: Django 5 should be faster, monitor your metrics
4. **Update CI/CD**: Ensure your deployment pipeline works with Python 3.10+

## Resources

- [Django 5.0 Release Notes](https://docs.djangoproject.com/en/5.0/releases/5.0/)
- [Django 5.1 Release Notes](https://docs.djangoproject.com/en/5.1/releases/5.1/)
- [Upgrading Django](https://docs.djangoproject.com/en/5.1/howto/upgrade-version/)

Your project structure and settings are already compatible with Django 5, so this should be a smooth upgrade!