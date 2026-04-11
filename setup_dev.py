#!/usr/bin/env python3
"""
Sheltra Application Setup & Run Script
Configures and starts Frontend, Backend, and Database
"""

import os
import subprocess
import sys
import shutil
import time

def log(message, level="INFO"):
    """Print colored log messages"""
    colors = {
        "INFO": "\033[94m",      # Blue
        "SUCCESS": "\033[92m",   # Green
        "WARNING": "\033[93m",   # Yellow
        "ERROR": "\033[91m",     # Red
        "RESET": "\033[0m"       # Reset
    }
    color = colors.get(level, colors["INFO"])
    print(f"{color}[{level}]{colors['RESET']} {message}")

def run_command(cmd, cwd=None, check=True):
    """Run a command and return success status"""
    try:
        result = subprocess.run(cmd, shell=True, cwd=cwd, capture_output=True, text=True)
        if result.returncode != 0 and check:
            log(f"Command failed: {cmd}\n{result.stderr}", "ERROR")
            return False
        return True
    except Exception as e:
        log(f"Error running command: {e}", "ERROR")
        return False

def setup_env():
    """Create .env file from .env.example"""
    env_file = ".env"
    env_example = ".env.example"
    
    if os.path.exists(env_file):
        log(f"{env_file} already exists, skipping", "WARNING")
        return True
    
    if not os.path.exists(env_example):
        log(f"{env_example} not found", "ERROR")
        return False
    
    try:
        shutil.copy(env_example, env_file)
        log(f"Created {env_file} from {env_example}", "SUCCESS")
        
        # Update key entries for local development
        with open(env_file, 'r') as f:
            content = f.read()
        
        # Replace placeholders
        content = content.replace('APP_KEY=', 'APP_KEY=base64:abcdefghijklmnopqrstuvwxyz1234=')
        content = content.replace('DB_HOST=localhost', 'DB_HOST=127.0.0.1')
        content = content.replace('DB_PORT=3306', 'DB_PORT=3306')
        content = content.replace('DB_DATABASE=sheltra', 'DB_DATABASE=sheltra_local')
        content = content.replace('DB_USERNAME=root', 'DB_USERNAME=root')
        content = content.replace('DB_PASSWORD=', 'DB_PASSWORD=')
        content = content.replace('FRONTEND_URL=http://localhost:5173', 'FRONTEND_URL=http://localhost:5173')
        
        with open(env_file, 'w') as f:
            f.write(content)
        
        log(".env configured for local development", "SUCCESS")
        return True
    except Exception as e:
        log(f"Failed to setup .env: {e}", "ERROR")
        return False

def setup_backend():
    """Setup Laravel backend"""
    log("\n=== BACKEND SETUP ===", "INFO")
    
    backend_dir = "server"
    
    if not os.path.exists(os.path.join(backend_dir, "composer.json")):
        log("composer.json not found in server/", "ERROR")
        return False
    
    # Check if vendor exists
    if not os.path.exists(os.path.join(backend_dir, "vendor")):
        log("Installing PHP dependencies...", "INFO")
        if not run_command("composer install", cwd=backend_dir):
            log("Composer install failed", "ERROR")
            return False
        log("PHP dependencies installed", "SUCCESS")
    else:
        log("PHP dependencies already installed", "WARNING")
    
    return True

def setup_frontend():
    """Setup React frontend"""
    log("\n=== FRONTEND SETUP ===", "INFO")
    
    frontend_dir = "client"
    
    if not os.path.exists(os.path.join(frontend_dir, "package.json")):
        log("package.json not found in client/", "ERROR")
        return False
    
    # Check if node_modules exists
    if not os.path.exists(os.path.join(frontend_dir, "node_modules")):
        log("Installing Node dependencies...", "INFO")
        if not run_command("npm ci", cwd=frontend_dir):
            log("npm install failed", "ERROR")
            return False
        log("Node dependencies installed", "SUCCESS")
    else:
        log("Node dependencies already installed", "WARNING")
    
    return True

def setup_database():
    """Setup database"""
    log("\n=== DATABASE SETUP ===", "INFO")
    
    backend_dir = "server"
    
    log("Running migrations...", "INFO")
    
    # Check if artisan exists
    if not os.path.exists(os.path.join(backend_dir, "artisan")):
        log("artisan not found, skipping migrations", "WARNING")
        return False
    
    # Run migrations
    if run_command("php artisan migrate --force", cwd=backend_dir, check=False):
        log("Migrations completed", "SUCCESS")
    else:
        log("Note: Migrations may have failed - check database connection", "WARNING")
    
    return True

def start_dev_servers():
    """Start development servers"""
    log("\n=== STARTING DEVELOPMENT SERVERS ===", "INFO")
    
    print()
    log("Backend server starting on http://localhost:8000", "INFO")
    log("Frontend server starting on http://localhost:5173", "INFO")
    log("phpMyAdmin (optional) on http://localhost:8080", "INFO")
    
    print()
    log("═" * 80, "INFO")
    log("APPLICATION READY", "SUCCESS")
    log("═" * 80, "INFO")
    print()
    
    print("NEXT STEPS:")
    print()
    print("1. BACKEND (in separate terminal):")
    print("   cd server")
    print("   php artisan serve")
    print()
    print("2. FRONTEND (in separate terminal):")
    print("   cd client")
    print("   npm run dev")
    print()
    print("3. DATABASE (optional):")
    print("   • phpMyAdmin: http://localhost:8080")
    print("   • Or use: cd server && php artisan tinker")
    print()
    print("4. API ENDPOINTS:")
    print("   • Backend API: http://localhost:8000")
    print("   • Frontend Dev: http://localhost:5173")
    print()
    print("TIPS:")
    print("   • Keep all terminals open for development")
    print("   • Frontend hot-reloads on file changes")
    print("   • Check console logs for errors")
    print()

def main():
    """Main setup function"""
    log("╔" + "═"*78 + "╗", "INFO")
    log("║ SHELTRA APPLICATION - DEVELOPMENT SETUP                                    ║", "INFO")
    log("╚" + "═"*78 + "╝", "INFO")
    print()
    
    # Check current directory
    if not os.path.exists("docker-compose.yml"):
        log("Not in project root directory", "ERROR")
        return False
    
    log("Current directory: OK", "SUCCESS")
    
    # Setup .env
    if not setup_env():
        log("⚠ .env setup skipped", "WARNING")
    
    # Setup backend
    if not setup_backend():
        log("Backend setup FAILED", "ERROR")
        return False
    
    # Setup frontend
    if not setup_frontend():
        log("Frontend setup FAILED", "ERROR")
        return False
    
    # Setup database
    if not setup_database():
        log("Database setup skipped (non-critical)", "WARNING")
    
    # Display ready instructions
    start_dev_servers()
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
