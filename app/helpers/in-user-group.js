import Helper from '@ember/component/helper';
import { service } from '@ember/service';
import appConstant from '../utils/app-constant';

export default class extends Helper {
  @service userInfo;

  compute(groups) {
    const groupUris = groups.map((group) => {
      return appConstant(`USER_GROUPS.${group?.toUpperCase()}`);
    });
    return this.userInfo.userGroups.some((userGroup) => groupUris.includes(userGroup.uri));
  }
}
