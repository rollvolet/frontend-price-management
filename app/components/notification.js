import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class NotificationComponent extends Component {
  @service notification;

  @action
  removeNotification(notification) {
    this.notification.remove(notification);
  }
}
