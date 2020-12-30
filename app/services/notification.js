import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { A } from '@ember/array';
import { warn } from '@ember/debug';
import { later } from '@ember/runloop';

export default class NotificationService extends Service {
  @tracked notifications = A();

  add(notification) {
    this.notifications.pushObject(notification);

    // Make notification automatically disappear, unless timeout = -1
    if (!notification.timeout) notification.timeout = 5000;
    if (notification.timeout > 0) {
      later(this, function() { this.remove(notification); },
            notification.timeout);
    }
  }

  remove(notification) {
    this.notifications.removeObject(notification);
  }

  addError(notification) {
    notification.level = 'error';
    warn(notification.error, { id: 'notification.error' });
    this.add(notification);
  }
}
