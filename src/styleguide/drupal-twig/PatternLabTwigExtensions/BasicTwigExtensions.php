<?php

namespace PatternLabTwigExtensions;

use Twig_Extension;
use Twig_ExtensionInterface;
use Twig_SimpleFilter;
use Twig_SimpleFunction;

/**
 * These filters come from drupal-twig-extensions.
 *
 * See more: https://github.com/pattern-lab/drupal-twig-extensions.
 */
class BasicTwigExtensions extends Twig_Extension implements Twig_ExtensionInterface {

  /**
   * Dummy function that passes a param straight through.
   *
   * @return string
   *   Returns whatever param was passed in with no modifications.
   */
  public static function returnParam($param) {
    return $param;
  }

  /**
   * Prepares a string for use as a valid HTML ID.
   *
   * @param string $id
   *   The ID to clean.
   *
   * @return string
   *   The cleaned ID.
   */
  public static function getId($id) {
    $id = str_replace([' ', '_', '[', ']'], ['-', '-', '-', ''], strtolower($id));
    $id = preg_replace('/[^A-Za-z0-9\\-_]/', '', $id);
    $id = preg_replace('/\\-+/', '-', $id);
    return $id;
  }

  /**
   * Dummy function that returns a simple '#'.
   *
   * @return string
   *   Returns a '#' character.
   */
  public static function inertHref() {
    return '#';
  }

  /**
   * Dummy function that returns nothing.
   *
   * @return string
   *   Returns a '' character.
   */
  public static function returnNothing() {
    return '';
  }

  /**
   * Returns a list of filters to add to the existing list.
   *
   * @link Drupal Twig Filters - https://www.drupal.org/docs/8/theming/twig/filters-modifying-variables-in-twig-templates
   *
   * @return \Twig_SimpleFilter[]
   *   Returns a list of filters.
   */
  public function getFilters() {
    return [
      new Twig_SimpleFilter('t', [$this, 'returnParam']),
      new Twig_SimpleFilter('render', [$this, 'returnParam']),
      new Twig_SimpleFilter('placeholder', [$this, 'returnParam']),
      new Twig_SimpleFilter('without', [$this, 'returnParam']),
      new Twig_SimpleFilter('clean_class', [$this, 'returnParam']),
      new Twig_SimpleFilter('clean_id', [$this, 'getId']),
    ];
  }

  /**
   * Returns a list of functions to add to the existing list.
   *
   * @link Drupal Twig Functions - https://www.drupal.org/node/2486991
   *
   * @return \Twig_SimpleFunction[]
   *   Returns list of functions.
   */
  public function getFunctions() {
    return [
      new Twig_SimpleFunction('url', [$this, 'inertHref']),
      new Twig_SimpleFunction('path', function ($string) {
        if ($string === '<front>') {
          return '/';
        }
        else {
          return $string;
        }
      }),
      new Twig_SimpleFunction('link', [$this, 'inertHref']),
      new Twig_SimpleFunction('file_url', [$this, 'returnParam']),
      new Twig_SimpleFunction('attach_library', [$this, 'returnNothing']),
    ];
  }

}
