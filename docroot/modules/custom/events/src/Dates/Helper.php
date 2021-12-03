<?php

namespace Drupal\events\Dates;

use Drupal\Core\TypedData\Type\DateTimeInterface;
use Drupal\node\NodeInterface;

/**
 * Helper offering some handy date processors.
 */
class Helper {

  /**
   * Return a string with years/months/days/hours/minutes/seconds countdown.
   *
   * @param \DateTimeInterface $date
   *   The date we should create the diff from. If this date is in the past
   *   respect to $now date an exception will be raise.
   * @param \DateTimeInterface|null $now
   *   An optional date to use as 'now' for the comparison. If missing current
   *   datetime will be used.
   */
  public static function countDown(\DateTimeInterface $date, ?\DateTimeInterface $now = NULL): string {
    $now ??= new \DateTime();
    if ($date < $now) {
      throw new \InvalidArgumentException('Date is in the past');
    }

    $diff = $date->diff($now);
    return sprintf('%d year(s), %d month(s), %d day(s), %d hour(s), %d minute(s), %d second(s)', $diff->y, $diff->m, $diff->d, $diff->h, $diff->i, $diff->s);
  }

  /**
   * Helper for running countDown() against event-like nodes.
   *
   * This method runs and returns countDown() output on any Drupal node with a
   * field_date datetime field. So not only events.
   *
   * @param \Drupal\node\NodeInterface $event
   *   The event - or node - we want the countdown for.
   *
   * @return string
   *   The countdown as per countDown().
   */
  public static function eventCountDown(NodeInterface $event): string {
    if ($event->hasField('field_date') && $event->getFieldDefinition('field_date')->getType() === 'datetime') {
      return static::countDown($event->field_date->date->getPhpDateTime());
    }
    throw new \InvalidArgumentException('Provided node does not have a field_date datetime field.');
  }

  /**
   * Helper function to return next X days from supplied datetime object.
   *
   * @param \DateTime $datetime
   *   Event datetime object.
   *
   * @param $count_days
   *   Number of days in the future from supplied datetime object.
   *
   * @return string
   *   Formatted date string.
   */
  public static function nextDay(\DateTimeInterface $date, $count_days) {
    $date->modify('+' . $count_days . ' days');
    return date_format($date, 'Y-m-d');
  }

  /**
   * Helper function to return previous X days from supplied datetime object.
   *
   * @param \DateTime $date
   *   Event datetime object.
   *
   * @param $count_days
   *   Number of days in the past from supplied datetime object.
   *
   * @return string
   *   Formatted date string.
   */
  public static function prevDay(\DateTimeInterface $date, $count_days) {
    $date->modify('-' . $count_days . ' days');
    return date_format($date, 'Y-m-d');
  }

}
