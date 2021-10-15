<?php

namespace Drupal\Tests\events\Functional;

use Drupal\datetime\Plugin\Field\FieldType\DateTimeItemInterface;
use Drupal\node\Entity\Node;
use Drupal\Tests\BrowserTestBase;

/**
 * Test description.
 *
 * @group wpp_events
 */
class EventsPageTest extends BrowserTestBase {

  /**
   * {@inheritdoc}
   */
  protected $defaultTheme = 'stable';

  /**
   * {@inheritdoc}
   */
  protected static $modules = [
    'events',
  ];

  /**
   * {@inheritdoc}
   */
  protected function setUp(): void {
    parent::setUp();
    $now = \Drupal::time()->getCurrentTime();
    $node = Node::create(['type' => 'event']);
    $node->setTitle('Yesterday');
    $node->field_date = gmdate(DateTimeItemInterface::DATE_STORAGE_FORMAT, $now - (60 * 60 * 24));
    $node->save();
    $node = Node::create(['type' => 'event']);
    $node->setTitle('Today');
    $node->field_date = gmdate(DateTimeItemInterface::DATE_STORAGE_FORMAT, $now);
    $node->save();
    $node = Node::create(['type' => 'event']);
    $node->setTitle('Tomorrow');
    $node->field_date = gmdate(DateTimeItemInterface::DATE_STORAGE_FORMAT, $now + (60 * 60 * 24));
    $node->save();
  }

  /**
   * Test Events page views.
   */
  public function testEventsPageViews() {
    $this->drupalGet('/events');
    $this->assertSession()->titleEquals('Upcoming Events | Drupal');
    // Main views has only 2 elements.
    $this->assertSession()->elementsCount('css', 'h1 + .views-element-container > div > .views-row', 2);
    // Attached view has only 1 element, and this is "Yesterday" event.
    $this->assertSession()->elementsCount('css', 'h1 + .views-element-container .views-element-container .views-row', 1);
    $this->assertSession()->elementTextContains('css', 'h1 + .views-element-container .views-element-container .views-row article a span', 'Yesterday');
  }

}
