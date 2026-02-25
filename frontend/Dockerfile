# frontend/Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files (we will generate these when we init React)
COPY package.json package-lock.json* ./
RUN npm install

COPY . .