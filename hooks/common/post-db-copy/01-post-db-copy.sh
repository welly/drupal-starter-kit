#!/bin/sh
#
# Cloud Hook: update-db
#
# Run drush updatedb in the target environment. This script works as
# any Cloud hook.

site="$1"
target_env="$2"
db_name="$3"
source_env="$4"

if [ "${target_env}" != 'prod' ]; then
  echo "$site.${target_env}: The ${source_env} database has been copied to ${target_env}."
  drush10 "@${site}.${target_env}" updb --no-post-updates -y --strict=0 --cache-clear=1 && \
  drush10 "@${site}.${target_env}" cc drush && \
  drush10 "@${site}.${target_env}" csex conditional_split -y && \
  drush10 "@${site}.${target_env}" cim sync -y && \
  drush10 "@${site}.${target_env}" updb --post-updates -y --strict=0 && \
  drush10 "@${site}.${target_env}" cr
fi
