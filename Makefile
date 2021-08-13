.SILENT:

install: up drupal-site-install front-end
	ddev restart

uninstall: docker-rm
	sudo rm -rf docroot config/default/sync/* vendor
up:
	ddev start
down:
	ddev stop
cc:
	ddev exec drush cr
cex:
	ddev exec drush cex -y
cim:
	ddev exec drush cim -y
uli:
	ddev exec drush uli

docker-rm:
	ddev stop
	ddev remove

drupal-site-install:
	ddev composer install
	vendor/bin/phpcs --config-set installed_paths vendor/drupal/coder/coder_sniffer
	ddev exec drush si minimal --existing-config
	ddev create-databases:all

mysql:
	ddev exec mysql -u db -pdb db

seed-db: seed-db-dev

seed-db-dev:
	ddev auth ssh && \
	ddev exec drush sql-sync -y @SITENAME.dev @self --create-db --structure-tables-list=cache_bootstrap,cache_config,cache_container,cache_data,cache_default,cache_discovery,cache_dynamic_page_cache,cache_entity,cache_file_mdm,cache_menu,cache_page,cache_render,cache_toolbar,cachetags,sessions,watchdog && \
	ddev exec drush cim
	ddev exec drush en stage_file_proxy -y && \
	ddev exec drush cset stage_file_proxy.settings origin 'http://starterkit.manifesto.co.uk/' -y

tests: coding-standards

phpunit:
	ddev exec 'SIMPLETEST_DB=$$(drush php:eval "print \Drupal\Core\Database\Database::getConnectionInfoAsUrl()") SIMPLETEST_BASE_URL=http://localhost bash -c "../vendor/bin/phpunit -c core modules/custom"' || \

coding-standards:
	docker run --rm -v `pwd`:/work skilldlabs/docker-phpcs-drupal phpcs --standard=Drupal,DrupalPractice docroot/modules/custom/

# Front-end tasks
front-end: pattern-lab-install tasks-install build-drupal-patterns drupal-theme

pattern-lab-install:
	cd pattern-lab && \
	npm install

pattern-lab-serve:
	cd pattern-lab && \
	npm run serve

pattern-lab-watch:
	cd tasks && \
	npm run gulp pattern-lab

tasks-install:
	cd tasks && \
	npm install

build-drupal-patterns:
	cd tasks && \
	npm run gulp copy-pattern-lab

drupal-theme:
	cd tasks && \
	npm run gulp -- drupal-theme --envi=prod

drupal-theme-watch:
	cd tasks && \
	npm run gulp drupal-theme
