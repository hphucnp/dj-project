# Django + Poetry Setup Guide

This guide will help you transition your Django project from using `requirements.txt` to Poetry for dependency management.

## Prerequisites

Make sure you have Poetry installed. If not, install it:

```bash
curl -sSL https://install.python-poetry.org | python3 -
```

Or using Homebrew on macOS:
```bash
brew install poetry
```

## Migration Steps

### 1. Initialize Poetry (if starting fresh)

```bash
cd backend
poetry init
```

### 2. Install Dependencies from pyproject.toml

Since we've already created the `pyproject.toml` file, you can install all dependencies:

```bash
cd backend
poetry install
```

This will:
- Create a virtual environment
- Install all production dependencies
- Install development dependencies
- Generate a `poetry.lock` file

### 3. Activate Poetry Environment

```bash
poetry shell
```

Or run commands directly with Poetry:

```bash
poetry run python manage.py runserver
```

### 4. Common Django Commands with Poetry

```bash
# Run development server
poetry run python manage.py runserver

# Run migrations
poetry run python manage.py migrate

# Create superuser
poetry run python manage.py createsuperuser

# Collect static files
poetry run python manage.py collectstatic

# Run tests
poetry run python manage.py test

# Or use pytest (included in dev dependencies)
poetry run pytest

# Format code with black
poetry run black .

# Check code style with flake8
poetry run flake8

# Sort imports with isort
poetry run isort .
```

### 5. Managing Dependencies

```bash
# Add a new dependency
poetry add package-name

# Add a development dependency
poetry add --group dev package-name

# Remove a dependency
poetry remove package-name

# Update all dependencies
poetry update

# Update a specific dependency
poetry update package-name

# Show installed packages
poetry show

# Show dependency tree
poetry show --tree
```

### 6. Environment Management

```bash
# Show environment info
poetry env info

# List environments
poetry env list

# Remove environment
poetry env remove python3.11
```

## Docker Usage

The Dockerfile has been updated to use Poetry. Build and run as usual:

```bash
# Build the image
docker-compose build backend

# Run the container
docker-compose up backend
```

## Benefits You'll Get

1. **Better Dependency Resolution**: Poetry resolves dependencies better than pip
2. **Lock Files**: `poetry.lock` ensures reproducible builds
3. **Development Dependencies**: Separate dev dependencies from production
4. **Virtual Environment Management**: Poetry handles venv creation/activation
5. **Modern Python Packaging**: Uses `pyproject.toml` standard

## Migration Checklist

- [x] Created `pyproject.toml` with your current dependencies
- [x] Updated `Dockerfile` to use Poetry
- [ ] Install Poetry on your system
- [ ] Run `poetry install` in the backend directory
- [ ] Test that Django runs with `poetry run python manage.py runserver`
- [ ] Commit the new files (`pyproject.toml`, `poetry.lock`)
- [ ] Update your CI/CD pipelines if any
- [ ] Update documentation for other developers

## Troubleshooting

### Poetry not found
Make sure Poetry is in your PATH. After installation, restart your terminal.

### Virtual environment issues
```bash
poetry env remove python3.11  # Remove existing env
poetry install                 # Recreate and install
```

### Dependency conflicts
```bash
poetry lock --no-update  # Regenerate lock file
poetry install           # Install from lock file
```

## Next Steps

1. You can keep the `requirements.txt` for now as a backup
2. Once you're comfortable with Poetry, you can remove `requirements.txt`
3. Consider adding more development tools like `mypy`, `pre-commit`, etc.
4. Update your team's documentation with Poetry commands