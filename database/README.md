# Database Files

This directory contains all database-related files for the Sheltra project.

## Structure

```
database/
├── DATABASE_SETUP.sql        # Initial database schema and setup script
├── migrations/               # Laravel database migrations
│   ├── 2024_01_01_*.php     # Core table migrations
│   ├── 2024_04_09_*.php     # Messages and payments tables
│   └── 2026_04_09_*.php     # Latest schema updates
├── seeders/                  # Database seeders for test data
│   ├── DatabaseSeeder.php    # Master seeder
│   ├── UserSeeder.php
│   ├── RefugeeProfileSeeder.php
│   ├── NGOProfileSeeder.php
│   ├── EmployerProfileSeeder.php
│   ├── SkillSeeder.php
│   └── ... other seeders
└── README.md                 # This file
```

## Usage

### Initial Setup
```bash
# Run the complete database setup
mysql -u root -p < DATABASE_SETUP.sql
```

### Laravel Migrations (Alternative)
```bash
# Run all migrations
php artisan migrate

# Run seeders for test data
php artisan db:seed
```

## Files

- **DATABASE_SETUP.sql** - Complete database schema with initial data
- **migrations/** - Individual table and schema changes
- **seeders/** - Data seeders for development and testing

## Notes

- All migrations are automatically discovered by Laravel
- Seeders can be run individually or through DatabaseSeeder
- For development, use Docker: `docker-compose up -d` will initialize the database
