FROM node:20-slim

# Install Python and ffmpeg (yt-dlp requires Python)
RUN apt-get update && apt-get install -y \
    python3 \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install Node.js dependencies (includes yt-dlp-exec which downloads yt-dlp automatically)
RUN npm install --production

# Copy application code
COPY . .

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3001/health', (r) => r.statusCode === 200 ? process.exit(0) : process.exit(1))"

# Start the application
CMD ["npm", "start"]
