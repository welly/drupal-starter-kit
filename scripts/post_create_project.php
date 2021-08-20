#!/usr/bin/php
<?php

const SCRIPT_TEMPLATES_DIRECTORY = 'scripts/templates/';

// We get the project name from the name of the path that Composer created for us.
$project_name = basename(realpath("."));
echo "project_name $project_name taken from directory name\n";

$replacements = [
  "{{ project_name }}" => $project_name,
];

$templates = [
  'composer.json' => '.',
  'config.yaml' => '.ddev',
  'Makefile' => '.',
];

foreach ($templates as $filename => $destination) {
  $target = $destination . '/' . $filename;

  // First we copy the dist file to its new location,
  // overwriting files we might already have there.
  copy(SCRIPT_TEMPLATES_DIRECTORY . $filename . '.template', $target);

  // Then we apply our replaces for within those templates.
  applyValues($target, $replacements);

}

/**
 * A method that will read a file, run a strtr to replace placeholders with
 * values from our replace array and write it back to the file.
 *
 * @param string $target the filename of the target
 * @param array $replaces the replaces to be applied to this target
 */
function applyValues($target, $replacements) {
  file_put_contents($target, strtr(file_get_contents($target), $replacements));
}
