#!/bin/sh
# This script enables/disables Xdebug as php-extension and restarts the container.
# Usage: docker/php-xdebug/toggleXdebug.sh <container_name>
# Instructions: https://richbrains.atlassian.net/wiki/spaces/~63ebfbbf5fa5d13d1e111754/pages/6239780865/Xdebug

container=$1

_status () {
  if [ "$(docker exec -u root $container php -m | grep xdebug)" = 'xdebug' ]; then
    echo 'ENABLED'
  else
    echo 'DISABLED'
  fi
}

_run () {
  if [ "$(_status)" = 'ENABLED' ]; then
    echo Disabling Xdebug...
    _disable
  else
    echo Enabling Xdebug...
    _enable
  fi

  echo Restarting container...
  _restart

  echo Xdebug is $(_status)
}

_enable () {
  docker exec -u root $container sed -i -e 's/^\;zend_extension/zend_extension/g' /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini
}

_disable () {
  docker exec -u root $container sed -i -e 's/^zend_extension/\;zend_extension/g' /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini
}

_restart () {
  docker restart $container
}

_run
