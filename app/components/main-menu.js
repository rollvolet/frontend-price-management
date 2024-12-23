import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class MainMenuComponent extends Component {
  @service userInfo;

  @tracked isOpenMenu = false;

  @action
  toggleIsOpenMenu() {
    this.isOpenMenu = !this.isOpenMenu;
  }

  get canEditUsers() {
    return this.userInfo.isAdmin;
  }
}
