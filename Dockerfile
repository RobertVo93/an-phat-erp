# Use Node.js LTS Alpine as the base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files and install dependencies
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install

# Do NOT copy the rest of the source code here; it will be mounted as a volume in dev

# Expose port
EXPOSE 3000

# Start the app
CMD ["pnpm", "dev"]