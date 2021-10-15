<?php

namespace Drupal\Tests\events\Unit;

use Drupal\Component\Datetime\DateTimePlus;
use Drupal\Core\Field\FieldDefinitionInterface;
use Drupal\node\NodeInterface;
use Drupal\Tests\UnitTestCase;
use Drupal\events\Dates\Helper;

/**
 * Test description.
 *
 * @group wpp_events
 */
class DateHelperTest extends UnitTestCase {

  /**
   * Tests Helper::countDown().
   *
   * @dataProvider dateInternalProvider
   */
  public function testCountDown($interval, $expected) {
    $date = new \DateTime();
    $now = clone $date;
    $date->add(new \DateInterval($interval));

    $this->assertSame($expected, Helper::countDown($date, $now));
  }

  /**
   * DateInterval Data provider for testCountDown().
   */
  public function dateInternalProvider() {
    return [
      // phpcs:disabled
      ['PT1S', '0 year(s), 0 month(s), 0 day(s), 0 hour(s), 0 minute(s), 1 second(s)'],
      ['PT1M2S', '0 year(s), 0 month(s), 0 day(s), 0 hour(s), 1 minute(s), 2 second(s)'],
      ['PT1H2M3S', '0 year(s), 0 month(s), 0 day(s), 1 hour(s), 2 minute(s), 3 second(s)'],
      ['P1Y2M3DT4H5M36S', '1 year(s), 2 month(s), 3 day(s), 4 hour(s), 5 minute(s), 36 second(s)'],
      // phpcs:enabled
    ];
  }

  /**
   * Tests Helper::countDown() without second argument (now).
   */
  public function testCountDownDefaultNow() {
    $date = new \DateTime();
    $date->add(new \DateInterval('P2Y3M4DT5H6M19S'));

    // We can't use assertSame here, since by the time we run countDown() a
    // second may elapse.
    $this->assertStringStartsWith('2 year(s), 3 month(s), 4 day(s), 5 hour(s), 6 minute(s), 1', Helper::countDown($date));
  }

  /**
   * Test Helper::countDown() throws an expection if $date is lower then $now.
   */
  public function testCountDownException() {
    $date = new \DateTime();
    $date->sub(new \DateInterval('PT10S'));

    $this->expectException(\InvalidArgumentException::class);
    $this->expectExceptionMessage('Date is in the past');
    Helper::countDown($date);
  }

  /**
   * Test eventCountDown() method, which requires prophesizing.
   */
  public function testEventCountDown() {
    $event = $this->prophesize(NodeInterface::class);
    $event->hasField('field_date')->willReturn(TRUE);
    $field_definition = $this->prophesize(FieldDefinitionInterface::class);
    $field_definition->getType()->willReturn('datetime');
    $event->getFieldDefinition('field_date')->willReturn($field_definition->reveal());

    $date = new \DateTime();
    $date->add(new \DateInterval('P2Y3M4DT5H6M19S'));
    $field_date = new \stdClass();
    $field_date->date = DateTimePlus::createFromDateTime($date);
    $event->field_date = $field_date;

    // We can't use assertSame here, since by the time we run countDown() 1
    // second may elapse.
    $this->assertStringStartsWith('2 year(s), 3 month(s), 4 day(s), 5 hour(s), 6 minute(s), 1', Helper::eventCountDown($event->reveal()));
  }

}
