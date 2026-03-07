# Backend-only Dockerfile for Laravel API
FROM php:8.2-apache

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git curl libpng-dev libonig-dev libxml2-dev zip unzip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Enable mod_rewrite for Laravel
RUN a2enmod rewrite

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Set Apache document root to Laravel's public directory
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Get Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy Laravel code
COPY . /var/www/html

WORKDIR /var/www/html

# Install Laravel dependencies
RUN composer install --no-dev --optimize-autoloader

# Set permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Generate .env from environment variables at container startup
RUN echo '#!/bin/bash\nenv | grep -E "^(APP_|DB_|FRONTEND_|LOG_|SANCTUM_|SESSION_)" | sed "s/=/=/" > /var/www/html/.env\nchown www-data:www-data /var/www/html/.env\nphp artisan config:clear\nexec apache2-foreground' > /usr/local/bin/start.sh \
    && chmod +x /usr/local/bin/start.sh

EXPOSE 80
CMD ["/usr/local/bin/start.sh"]
