# Executables
DOCKER         = docker
DOCKER_COMPOSE = docker compose --env-file .env

# Docker containers
APP_CONT = $(DOCKER_COMPOSE) exec app

# Executables
PHP      = $(APP_CONT) php
NPM      = npm
COMPOSER = $(APP_CONT) composer
SYMFONY  = $(APP_CONT) php bin/console

# Misc
.DEFAULT_GOAL = help

## ——  Makefile  ———————————————————————————————————————————————————————————————————————————————————————————————————————
.PHONY: help
help: ## Output this help message
	@grep -E '(^[a-zA-Z0-9\./_-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}{printf "\033[32m%-30s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m\n/'

## ——  Project  ————————————————————————————————————————————————————————————————————————————————————————————————————————
.PHONY: init
init: down build vendor ## Initialize the project

## ——  Docker  —————————————————————————————————————————————————————————————————————————————————————————————————————————
.PHONY: up
up: ## Start the containers
	@ $(DOCKER_COMPOSE) up -d

.PHONY: build
build: ## Build the containers
	@ $(DOCKER_COMPOSE) up -d --build

.PHONY: down
down: ## Stop the containers
	@ $(DOCKER_COMPOSE) down

.PHONY: php
php: ## Connect to the project container
	@ $(APP_CONT) sh

## ——  App  ————————————————————————————————————————————————————————————————————————————————————————————————————————————
.PHONY: cc
cc: ## Clear the cache
	@ $(SYMFONY) cache:clear

.PHONY: cw
cw: ## Warmup the cache
	@ $(SYMFONY) cache:warmup

cu: cc cw ## Update the cache

xdebug-check: ## Check if Xdebug is enabled
	@ $(PHP) -m | grep xdebug

xdebug-toggle: ## Toggle the xdebug
	@ docker/php/toggleXdebug library

## ——  Composer  ———————————————————————————————————————————————————————————————————————————————————————————————————————
.PHONY: composer
composer: ## Run composer, pass the parameter "c=" to run a given command, example: make composer c='req symfony/orm-pack'
	@ $(eval c ?=)
	@ $(COMPOSER) $(c)

.PHONY: vendor
vendor: ## Install composer dependencies
	@ $(COMPOSER) install --optimize-autoloader --ignore-platform-reqs

## ——  Symfony  ————————————————————————————————————————————————————————————————————————————————————————————————————————
.PHONY: symfony
symfony: ## Run app/console, pass the parameter "c=" to run a given command, example: make symfony c=about
	@ $(eval c ?=)
	@ $(SYMFONY) $(c)

## ——  NPM  ————————————————————————————————————————————————————————————————————————————————————————————————————————————

## ——  Queue  ——————————————————————————————————————————————————————————————————————————————————————————————————————————

## ——  Symfony Commands  ———————————————————————————————————————————————————————————————————————————————————————————————
email-consumer:
	@ $(SYMFONY) messenger:consume sqs-email -v

## —— Lint —————————————————————————————————————————————————————————————————————————————————————————————————————————————
lint: ## Lint the project
	-@ $(COMPOSER) run php-cs-fixer-dry
	-@ $(COMPOSER) run rector-dry
	-@ $(NPM) run type-check
	-@ $(NPM) run lint

format: ## Fix lint issues in the project
	-@ $(COMPOSER) run php-cs-fixer
	-@ $(COMPOSER) run rector
	-@ $(NPM) run format
	-@ $(NPM) run eslint-fix
