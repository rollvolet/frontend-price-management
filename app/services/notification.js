import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { warn } from '@ember/debug';
import { later } from '@ember/runloop';
import { TrackedArray } from 'tracked-built-ins';

export default class NotificationService extends Service {
  @tracked notifications = new TrackedArray([]);

  add(notification) {
    this.notifications.push(notification);

    // Make notification automatically disappear, unless timeout = -1
    if (!notification.timeout) notification.timeout = 5000;
    if (notification.timeout > 0) {
      later(
        this,
        function () {
          this.remove(notification);
        },
        notification.timeout
      );
    }
  }

  remove(notification) {
    const i = this.notifications.indexOf(notification);
    if (i >= 0) {
      this.notifications.splice(i, 1);
    }
  }

  addError(notification) {
    notification.level = 'error';
    warn(notification.error, { id: 'notification.error' });
    this.add(notification);
  }
}
