FROM php:8.3-fpm-alpine3.20

WORKDIR /srv/app

COPY --from=mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/local/bin/
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

RUN apk add --no-cache \
	acl \
	fcgi \
	file \
	gettext \
	git

RUN set -eux; install-php-extensions \
	apcu \
	intl \
	opcache \
	zip \
	pdo \
	redis \
	gd

###> recipes ###
###> doctrine/doctrine-bundle ###
RUN apk add --no-cache --virtual .pgsql-deps postgresql-dev; \
	docker-php-ext-install -j"$(nproc)" pdo_pgsql; \
	apk add --no-cache --virtual .pgsql-rundeps so:libpq.so.5; \
	apk del .pgsql-deps
###< doctrine/doctrine-bundle ###
###< recipes ###

COPY config/php-fpm.conf /usr/local/etc/php-fpm.d/php-fpm.conf
COPY config/php.ini      $PHP_INI_DIR/php.ini
COPY config/xdebug.ini   $PHP_INI_DIR/conf.d/docker-php-ext-xdebug.ini

# Copy entrypoint
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

RUN chown -R www-data:1000 /tmp
RUN chmod -R 775 /tmp

RUN composer require

USER www-data

ENTRYPOINT ["entrypoint.sh"]
CMD ["php-fpm"]
