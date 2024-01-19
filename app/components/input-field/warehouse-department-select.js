import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';
import { inject as service } from '@ember/service';
import { keepLatestTask } from 'ember-concurrency';

export default class InputWarehouseDepartmentSelectComponent extends Component {
  @service store;

  @tracked options = [];
  @tracked selected;

  constructor() {
    super(...arguments);
    this.loadData.perform();
  }

  @keepLatestTask
  *loadData() {
    this.options = this.store.peekAll('warehouse-department').slice(0).sort((a, b) => {
      return a.label > b.label ? 1 : -1;
    });

    const value = yield this.args.value; // argument may be a promise/proxy object
    if (value) {
      const selected = this.options.find((opt) => opt.uri == value.uri);
      if (!selected) {
        // selected value cannot be found in list of options, hence unset selected value
        this.args.onSelectionChange(null);
      }
    }
  }

  get fieldId() {
    return `warehouse-department-select-${guidFor(this)}`;
  }
}
