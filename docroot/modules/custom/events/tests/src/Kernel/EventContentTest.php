<?php

namespace Drupal\Tests\events\Kernel;

use Drupal\Core\Render\Element\Date;
use Drupal\KernelTests\KernelTestBase;
use Drupal\node\Entity\Node;

/**
 * Test description.
 *
 * @group wpp_events
 */
class EventContentTest extends KernelTestBase {

  /**
   * {@inheritdoc}
   */
  protected static $modules = [
    'events',
    'field',
    'filter',
    'datetime',
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
    $this->installConfig(['events', 'filter', 'node', 'system', 'taxonomy']);
    $this->installEntitySchema('node');
    $this->installEntitySchema('taxonomy_term');
    $this->installEntitySchema('user');

    $node = Node::create(['type' => 'event']);
    $node->setTitle('Event 1');
    $node->field_date = date('Y-m-d');
    $node->save();
    $a = 1;
  }

  /**
   * Test basic required events fields are there and working.
   */
  public function testBasicFields() {
    $node = Node::load(1);
    $this->assertSame('Event 1', $node->label());
  }

}
