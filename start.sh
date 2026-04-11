#!/bin/bash
# Sheltra Development Server Startup Script

echo "████████ SHELTRA APPLICATION STARTUP ████████"
echo ""

PROJECT_ROOT="$(pwd)"
echo "Working directory: $PROJECT_ROOT"
echo ""

# Function to start frontend
start_frontend() {
    echo "Starting Frontend Dev Server..."
    cd "$PROJECT_ROOT/client"
    npm run dev
}

# Function to start backend  
start_backend() {
    echo "Starting Backend Server..."
    cd "$PROJECT_ROOT/server"
    php artisan serve --host=0.0.0.0 --port=8000
}

# Function to start docker stack
start_docker() {
    echo "Starting Docker Stack (Database + Services)..."
    cd "$PROJECT_ROOT"
    docker-compose -f docker-compose.prod.yml up -d
}

echo "Select startup option:"
echo "1) Frontend Only (npm run dev)"
echo "2) Backend Only (php artisan serve)"
echo "3) Full Docker Stack (Database + Services)"
echo "4) Frontend + Backend (requires 2 terminals)"
echo ""
echo "Running Frontend by default..."
echo ""

start_frontend
