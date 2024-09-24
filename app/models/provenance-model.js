import Model, { attr } from '@ember-data/model';
import { inject as service } from '@ember/service';

export default class ProvenanceModel extends Model {
  @service userInfo;

  @attr('datetime') created;
  @attr('datetime') modified;
  @attr('string') creator;
  @attr('string') editor;

  save() {
    const now = new Date();
    if (this.isNew) {
      this.created = now;
      this.creator = this.userInfo.user.uri;
    }
    if (this.hasDirtyAttributes) {
      this.modified = now;
      this.editor = this.userInfo.user.uri;
    }
    return super.save(...arguments);
  }
}
