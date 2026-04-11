# Backend-only Dockerfile for Laravel API
FROM php:8.2-apache

# Set timezone for consistent timestamps
ENV TZ=UTC

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git curl libpng-dev libonig-dev libxml2-dev zip unzip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Enable required Apache modules
RUN a2enmod rewrite && a2enmod headers

# Set ServerName to suppress Apache warnings
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Install required PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Set Apache document root to Laravel's public directory
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Get Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy only backend files (exclude frontend, client, database, etc.)
# This assumes Render uses server/ as the build context, or uses root with .dockerignore
COPY . /var/www/html/

WORKDIR /var/www/html

# Install Laravel dependencies (production-optimized)
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-progress

# Set proper permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost/api/health || exit 1

CMD ["/bin/sh", "-c", "php artisan config:clear 2>/dev/null || true && php artisan cache:clear 2>/dev/null || true && exec apache2-foreground"]
