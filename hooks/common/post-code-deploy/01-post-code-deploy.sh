#!/bin/sh
#
# Cloud Hook: update-db
#
# Run drush updatedb in the target environment. This script works as
# any Cloud hook.

site="$1"
target_env="$2"
source_branch="$3"
deployed_tag="$4"
repo_url="$5"
repo_type="$6"

if [ "${target_env}" != 'prod' ]; then
  echo "${site}.${target_env}: The ${source_branch} branch has been updated on ${target_env}."
  drush10 "@${site}.${target_env}" updb --no-post-updates -y --strict=0 --cache-clear=1 && \
  drush10 "@${site}.${target_env}" cc drush && \
  drush10 "@${site}.${target_env}" csex conditional_split -y && \
  drush10 "@${site}.${target_env}" cim sync -y && \
  drush10 "@${site}.${target_env}" updb --post-updates -y --strict=0 && \
  drush10 "@${site}.${target_env}" cr
else
  echo "${site}.${target_env}: The ${source_branch} branch has been updated on ${target_env}."
  echo "Acquia hooks have been skipped for the ${target_env} environment."
  echo "Please run any post deployment steps manually."
fi
