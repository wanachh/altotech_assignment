# backend/Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Prevent Python from writing pyc files and keep stdout unbuffered
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# We will create this requirements.txt file later
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .