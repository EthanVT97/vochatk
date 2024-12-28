# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY vochatk/package*.json ./

# Install dependencies
RUN npm ci

# Copy project files
COPY vochatk/ .

# Remove any existing next.config.ts
RUN rm -f next.config.ts

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Start the application
CMD ["node", "server.js"]
