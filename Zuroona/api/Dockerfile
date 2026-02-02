# Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev) to resolve peer dependencies
# We'll filter to production only in the final stage
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Production stage
FROM node:18-alpine

# Install production dependencies
RUN apk add --no-cache tini

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Set working directory
WORKDIR /app

# Copy package files first
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev --legacy-peer-deps && \
    npm cache clean --force

# Copy source code
COPY --from=builder /app/src ./src

# Set ownership to non-root user
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Set environment variables
ENV NODE_ENV=production

# Expose port (default 3434, can be overridden via environment)
EXPOSE 3434

# Use tini as entrypoint
ENTRYPOINT ["/sbin/tini", "--"]

# Start the application
CMD ["node", "src/app.js"] 