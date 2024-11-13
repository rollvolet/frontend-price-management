import Helper from '@ember/component/helper';
import { service } from '@ember/service';

export default class extends Helper {
  @service userInfo;
  compute() {
    return this.userInfo.isPriceAdmin;
  }
}
