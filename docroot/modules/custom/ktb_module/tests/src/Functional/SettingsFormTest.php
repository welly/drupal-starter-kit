<?php

namespace Drupal\Tests\ktb_module\Functional;

use Drupal\Tests\BrowserTestBase;

/**
 * Test the module settings page
 *
 * @group ktb_module
 */
class SettingsFormTest extends BrowserTestBase {

  /**
   * The modules to load to run the test.
   *
   * @var array
   */
  protected static $modules = [
    'user',
    'ktb_module',
  ];

  /**
   * {@inheritdoc}
   */
  protected $defaultTheme = 'stark';

  /**
   * {@inheritdoc}
   */
  protected function setUp(): void {
    parent::setUp();
  }

  /**
   * Tests the settings form.
   */
  public function testForm() {
    // Create the user with the appropriate permission.
    $admin_user = $this->drupalCreateUser();

    // Start the session.
    $session = $this->assertSession();

    // Login as our account.
    $this->drupalLogin($admin_user);
  }

}
