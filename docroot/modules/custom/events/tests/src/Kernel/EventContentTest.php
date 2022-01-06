<?php

namespace Drupal\Tests\events\Kernel;

use Drupal\Core\Render\Element\Date;
use Drupal\KernelTests\KernelTestBase;
use Drupal\node\Entity\Node;
use Drupal\Tests\node\Traits\NodeCreationTrait;
use Drupal\Tests\user\Traits\UserCreationTrait;

/**
 * Test description.
 *
 * @group wpp_events
 */
class EventContentTest extends KernelTestBase {

  // Additional traits can be imported for more prebuilt tools in the tests.
  use NodeCreationTrait;
  use UserCreationTrait;

  /**
   * {@inheritdoc}
   */
  protected static $modules = [
    'datetime',
    'events',
    'field',
    'filter',
    'menu_ui',
    'node',
    'system',
    'taxonomy',
    'text',
    'user',
    'views',
  ];

  /**
   * {@inheritdoc}
   */
  protected function setUp(): void {
    parent::setUp();

    $this->installSchema('system', ['sequences']);
    $this->installSchema('node', ['node_access']);
    $this->installSchema('user', ['users_data']);

    $this->installEntitySchema('node');
    $this->installEntitySchema('user');
    $this->installEntitySchema('view');

    $this->installConfig(['events', 'filter', 'node', 'system', 'taxonomy', 'views']);

    $this->owner = $this->createUser([], 'testuser');
  }

  /**
   * Test basic required events fields are there and working.
   */
  public function testBasicFields() {
    $nodeTitle = 'Event 1';

    $node = $this->createNode([
      'title' => $nodeTitle,
      'type' => 'event',
      'uid' => $this->owner->id(),
      'field_date' => date('Y-m-d'),
    ]);

    $this->assertEquals($nodeTitle, $node->getTitle());
    $this->assertEquals('2022-01-04', $node->get('field_date')->value);

  }

}
