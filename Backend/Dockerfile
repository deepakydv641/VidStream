# Use Node.js 18 Alpine image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Create public/temp directory for uploads
RUN mkdir -p public/temp

# Expose port
EXPOSE 8000

# Start the application
CMD ["npm", "start"]
