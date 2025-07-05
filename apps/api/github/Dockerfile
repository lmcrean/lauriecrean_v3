# Use minimal Node.js image for smallest footprint
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with minimal footprint
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Set ownership
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port (Cloud Run requires PORT env variable)
EXPOSE 8080

# Set production environment
ENV NODE_ENV=production

# Start the application
CMD ["node", "dist/index.js"] 