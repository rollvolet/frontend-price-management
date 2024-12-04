import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class RlvActionMenuComponent extends Component {
  @tracked isOpenActionMenu = false;

  get sizeClass() {
    if (this.args.size == 'small') {
      return 'button--small';
    } else if (this.args.size == 'large') {
      return 'button--large';
    } else if (this.args.size == 'xlarge') {
      return 'button--xlarge';
    } else {
      return 'button--normal';
    }
  }

  @action
  openActionMenu() {
    this.isOpenActionMenu = true;
  }

  @action
  closeActionMenu() {
    this.isOpenActionMenu = false;
  }
}
