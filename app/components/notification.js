import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class NotificationComponent extends Component {
  @service notification;

  @action
  removeNotification(notification) {
    this.notification.remove(notification);
  }
}
