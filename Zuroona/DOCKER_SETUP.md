# Docker Setup Guide for Zuroona

This guide explains how to set up and run the Zuroona project using Docker Compose.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- At least 4GB of available RAM
- At least 10GB of available disk space

## Project Structure

The project consists of three main services:
- **web**: Next.js frontend application (Port 3000)
- **api**: Express.js backend API (Port 3434)
- **admin**: Next.js admin panel (Port 3002)
- **mongodb**: MongoDB database (Port 27017)

## Quick Start

1. **Create environment file**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and fill in your configuration values.

2. **Build and start all services**
   ```bash
   docker-compose up -d --build
   ```

3. **View logs**
   ```bash
   docker-compose logs -f
   ```

4. **Stop all services**
   ```bash
   docker-compose down
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

### Port Configuration
```
API_PORT=3434
WEB_PORT=3000
ADMIN_PORT=3002
```

### MongoDB Configuration
```
MONGODB_URI=mongodb://mongodb:27017/jeena
```

### API Service Variables
```
SECRET_KEY=your-secret-key-here
PKEYPATH=path-to-private-key
CPATH=path-to-certificate
```

### AWS S3 Configuration
```
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_BUCKET_NAME=your-s3-bucket-name
AWS_REGION=your-aws-region
```

### Web Service Variables
```
NEXT_PUBLIC_API_BASE_URL=http://api:3434/api/
NEXT_PUBLIC_API_URL=http://api:3434/api
NEXT_PUBLIC_S3_BUCKET=your-s3-bucket-name
NEXT_PUBLIC_S3_REGION=your-aws-region
NEXT_PUBLIC_S3_URL=https://your-s3-url.com
NEXT_PUBLIC_S3_DIR=Zuroona
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

### Admin Service Variables
```
NEXT_PUBLIC_API_ADMIN_BASE_URL=http://api:3434/api/admin/
NEXT_PUBLIC_MAPS_API_KEY=your-google-maps-api-key
```

## Service URLs

Once all services are running:
- **Web Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:3002
- **API**: http://localhost:3434
- **MongoDB**: localhost:27017

## Docker Commands

### Build services
```bash
docker-compose build
```

### Start services
```bash
docker-compose up -d
```

### Stop services
```bash
docker-compose down
```

### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api
docker-compose logs -f web
docker-compose logs -f admin
```

### Restart a service
```bash
docker-compose restart api
```

### Rebuild and restart a service
```bash
docker-compose up -d --build api
```

### Remove all containers and volumes
```bash
docker-compose down -v
```

## Development vs Production

### Development
For development, you may want to mount your source code as volumes to enable hot-reloading. Update `docker-compose.yml` to add volume mounts:

```yaml
web:
  volumes:
    - ./web:/app
    - /app/node_modules
    - /app/.next
```

### Production
The current setup is optimized for production with:
- Multi-stage builds for smaller images
- Standalone Next.js output
- Non-root users for security
- Health checks for all services

## Troubleshooting

### Port already in use
If you get port conflicts, change the ports in `.env`:
```
API_PORT=3435
WEB_PORT=3001
ADMIN_PORT=3003
```

### MongoDB connection issues
Ensure MongoDB service is healthy:
```bash
docker-compose ps
```
Check MongoDB logs:
```bash
docker-compose logs mongodb
```

### Build failures
Clear Docker cache and rebuild:
```bash
docker-compose build --no-cache
```

### Permission issues
On Linux, you may need to fix permissions:
```bash
sudo chown -R $USER:$USER .
```

## Data Persistence

MongoDB data is persisted in Docker volumes:
- `mongodb_data`: Database files
- `mongodb_config`: Configuration files

To backup MongoDB data:
```bash
docker exec zuroona-mongodb mongodump --out /data/backup
```

To restore:
```bash
docker exec zuroona-mongodb mongorestore /data/backup
```

## Network

All services communicate through the `zuroona-network` Docker network. Services can reference each other by their service names:
- `api` for the API service
- `web` for the web service
- `admin` for the admin service
- `mongodb` for the database

## Health Checks

All services include health checks. Check service health:
```bash
docker-compose ps
```

Healthy services will show as "healthy" in the status column.
