# Caddy Configuration Guide

## Why Caddy?

Caddy has been chosen over Nginx for this project because:

1. **Automatic HTTPS** - Caddy automatically obtains and renews SSL certificates from Let's Encrypt
2. **Simpler Configuration** - More readable and concise configuration syntax
3. **Modern Design** - Built with modern web standards in mind
4. **Better Defaults** - Secure defaults out of the box
5. **HTTP/2 & HTTP/3** - Built-in support for modern protocols

## Caddyfile Breakdown

```caddyfile
:80 {
    # Root directory for static files
    root * /srv

    # Enable gzip compression
    encode gzip

    # API and Admin proxy routes
    @api {
        path /api/* /admin/* /static/*
    }

    reverse_proxy @api backend:8000 {
        header_up Host {host}
        header_up X-Real-IP {remote_host}
        header_up X-Forwarded-For {remote_host}
        header_up X-Forwarded-Proto {scheme}
    }

    # SPA fallback - serve index.html for all non-file routes
    try_files {path} /index.html

    # Serve static files
    file_server

    # Logging
    log {
        output stdout
        format console
    }
}
```

### What Each Section Does:

1. **`:80`** - Listen on port 80 (HTTP)
   - For production with a domain, replace with your domain name: `yourdomain.com`
   - Caddy will automatically enable HTTPS

2. **`root * /srv`** - Set the root directory for serving files
   - React build files are copied to `/srv` in the Docker container

3. **`encode gzip`** - Enable gzip compression
   - Reduces file sizes for faster loading

4. **`@api` matcher** - Define routes to proxy to the backend
   - `/api/*` - API endpoints
   - `/admin/*` - Django admin panel
   - `/static/*` - Django static files

5. **`reverse_proxy @api backend:8000`** - Proxy matching routes to Django
   - Forwards requests to the backend container on port 8000
   - Includes proper headers for client information

6. **`try_files {path} /index.html`** - SPA fallback
   - Enables client-side routing for React
   - If a file doesn't exist, serve index.html

7. **`file_server`** - Serve static files
   - Serves the React build files

8. **`log`** - Configure logging
   - Outputs to stdout for Docker logs

## Enabling HTTPS (Production)

For production with a real domain:

### Update Caddyfile:

```caddyfile
yourdomain.com {
    root * /srv
    encode gzip

    @api {
        path /api/* /admin/* /static/*
    }

    reverse_proxy @api backend:8000 {
        header_up Host {host}
        header_up X-Real-IP {remote_host}
        header_up X-Forwarded-For {remote_host}
        header_up X-Forwarded-Proto {scheme}
    }

    try_files {path} /index.html
    file_server

    log {
        output file /var/log/caddy/access.log
    }
}
```

### Update docker-compose.yml:

```yaml
frontend:
  build:
    context: ./frontend
    dockerfile: Dockerfile
  ports:
    - "80:80"
    - "443:443"  # Add HTTPS port
  volumes:
    - caddy_data:/data
    - caddy_config:/config
  depends_on:
    - backend
  environment:
    - REACT_APP_API_URL=https://yourdomain.com/api
```

That's it! Caddy will automatically:
- Obtain an SSL certificate from Let's Encrypt
- Configure HTTPS
- Redirect HTTP to HTTPS
- Auto-renew certificates

## Advanced Features

### Custom Headers

Add security headers:

```caddyfile
:80 {
    header {
        # Enable HSTS
        Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
        # Prevent XSS attacks
        X-XSS-Protection "1; mode=block"
        # Prevent clickjacking
        X-Frame-Options "SAMEORIGIN"
        # Prevent MIME sniffing
        X-Content-Type-Options "nosniff"
    }

    # ... rest of config
}
```

### Rate Limiting

```caddyfile
:80 {
    @api {
        path /api/*
    }

    rate_limit @api {
        zone api_zone
        rate 100r/m  # 100 requests per minute
    }

    # ... rest of config
}
```

### Multiple Backends

```caddyfile
:80 {
    @api {
        path /api/*
    }

    @backend2 {
        path /other-api/*
    }

    reverse_proxy @api backend:8000
    reverse_proxy @backend2 other-service:9000

    # ... rest of config
}
```

## Troubleshooting

### View Caddy Logs

```bash
docker compose logs -f frontend
```

### Validate Caddyfile

```bash
docker compose exec frontend caddy validate --config /etc/caddy/Caddyfile
```

### Reload Configuration

```bash
docker compose exec frontend caddy reload --config /etc/caddy/Caddyfile
```

### Check Caddy Status

```bash
docker compose exec frontend caddy list-modules
```

## Comparison: Caddy vs Nginx

| Feature | Caddy | Nginx |
|---------|-------|-------|
| Auto HTTPS | ✅ Built-in | ❌ Requires Certbot |
| Config Syntax | Simple, readable | Complex |
| HTTP/3 | ✅ Built-in | ⚠️ Needs compilation |
| Default Security | ✅ Secure by default | ⚠️ Needs configuration |
| Reload Config | Zero downtime | Zero downtime |
| Performance | Excellent | Excellent |
| Memory Usage | Slightly higher | Lower |

## Resources

- [Caddy Documentation](https://caddyserver.com/docs/)
- [Caddyfile Directives](https://caddyserver.com/docs/caddyfile/directives)
- [Caddy Docker Image](https://hub.docker.com/_/caddy)
- [Caddy Community Forum](https://caddy.community/)
