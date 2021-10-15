.SILENT:

install: up drupal-site-install front-end
	ddev restart

uninstall: rm
	sudo rm -rf docroot config/default/sync/* vendor

up:
	ddev start

down:
	ddev stop

cc:
	ddev drush cr

cex:
	ddev drush cex -y

cim:
	ddev drush cim -y

uli:
	ddev drush uli

rm:
	ddev stop
	ddev remove

drupal-site-install:
	ddev composer install
	vendor/bin/phpcs --config-set installed_paths vendor/drupal/coder/coder_sniffer
	ddev drush si minimal --existing-config
	ddev drush uli

mysql:
	ddev exec mysql -u db -pdb db

seed-db: seed-db-dev

seed-db-dev:
	ddev auth ssh && \
	ddev drush sql-sync -y @SITENAME.dev @self --create-db --structure-tables-list=cache_bootstrap,cache_config,cache_container,cache_data,cache_default,cache_discovery,cache_dynamic_page_cache,cache_entity,cache_file_mdm,cache_menu,cache_page,cache_render,cache_toolbar,cachetags,sessions,watchdog && \
	ddev drush cim
	ddev drush en stage_file_proxy -y && \
	ddev drush cset stage_file_proxy.settings origin 'http://starterkit.manifesto.co.uk/' -y

#######################################
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

#######################################
# Test tasks

run-tests-custom:
	mkdir -p docroot/sites/simpletest/browser_output
	chmod 777 docroot/sites/simpletest/browser_output
	ddev exec 'bash -c "./vendor/bin/phpunit -c docroot/core docroot/modules/custom"'

run-tests-core:
	mkdir -p docroot/sites/simpletest/browser_output
	chmod 777 docroot/sites/simpletest/browser_output
	ddev exec 'bash -c "./vendor/bin/phpunit -c docroot/core docroot/core/modules/action"'

run-tests-core-javascript:
	mkdir -p docroot/sites/simpletest/browser_output
	chmod 777 docroot/sites/simpletest/browser_output
	ddev exec -d /var/www/html/docroot 'bash -c "../vendor/bin/phpunit -c core core/modules/big_pipe/tests/src/FunctionalJavascript"'

run-tests-nightwatch:
	ddev exec -d /var/www/html/docroot/core yarn test:nightwatch --tag core
