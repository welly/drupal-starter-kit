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
    'user',
    'node',
    'events',
  ];

  /**
   * {@inheritdoc}
   */
  protected function setUp(): void {
    parent::setUp();
    $this->installEntitySchema('user');
    $this->installEntitySchema('node');

    $node = Node::create(['type' => 'event']);
    $node->setTitle('Event 1');
    $node->field_date = date('Y-m-d');
    $node->save();
  }

  /**
   * Test basic required events fields are there and working.
   */
  public function testBasicFields() {
    $node = Node::load(1);
    $this->assertSame('Event 1', $node->label());
  }

}
