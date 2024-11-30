import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class MainMenuComponent extends Component {
  @service userInfo;

  @tracked isOpenMenu = false;

  get canEditPrice() {
    return this.userInfo.isPriceAdmin;
  }
  @action
  toggleIsOpenMenu() {
    this.isOpenMenu = !this.isOpenMenu;
  }
}
