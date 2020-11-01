import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class MainController extends Controller {
  @service preloader;

  @tracked isOpenMenu = false;

  @action
  toggleIsOpenMenu() {
    this.isOpenMenu = !this.isOpenMenu;
  }
}
