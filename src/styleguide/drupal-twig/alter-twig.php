<?php

/**
 * @file
 * Loads BasicTwigExtensions for Pattern Lab Node.
 */

use PatternLabTwigExtensions\BasicTwigExtensions;

/**
 * Enable Drupal Twig extensions for Pattern Lab.
 *
 * @param Twig_Environment $env
 *   - The Twig Environment
 *   - https://twig.symfony.com/api/1.x/Twig_Environment.html.
 * @param object $config
 *   - Config of `@basalt/twig-renderer`.
 */
function twig_extensions(Twig_Environment &$env, $config) {

  // Load the \BasicTwigExtensions class so the extension
  // can be added correctly.
  spl_autoload_register(function ($class_name) {
    $class_name = str_replace('\\', DIRECTORY_SEPARATOR, $class_name);
    include_once __DIR__ . '/' . $class_name . '.php';
  });

  $env->addExtension(new \Twig_Extension_Debug());
  $env->addExtension(new BasicTwigExtensions());
}
