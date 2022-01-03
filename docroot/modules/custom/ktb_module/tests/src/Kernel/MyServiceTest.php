<?php

namespace Drupal\Tests\ktb_module\Kernel;

use Drupal\KernelTests\KernelTestBase;

/**
 * Tests the MyService
 *
 * @group my_module
 */
class MyServiceTest extends KernelTestBase {

  /**
   * The service under test.
   *
   * @var \Drupal\ktb_module\MyServiceInterface
   */
  protected $myService;

  /**
   * The modules to load to run the test.
   *
   * @var array
   */
  public static $modules = [
    'ktb_module',
    'ktb_module_service_test',
  ];

  /**
   * {@inheritdoc}
   */
  protected function setUp() {
    parent::setUp();

    $this->installConfig(['ktb_module']);

    $this->myService = \Drupal::service('ktb_module.status_text');
  }
}
