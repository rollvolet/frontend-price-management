import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { keepLatestTask, all } from 'ember-concurrency';

export default class InputUnitCodeSelectComponent extends Component {
  @service store;

  @tracked options = [];
  @tracked selected;

  constructor() {
    super(...arguments);
    this.loadData.perform();
  }

  @keepLatestTask
  *loadData() {
    this.options = this.store.peekAll('unit-code').sortBy('label');

    const value = yield this.args.value; // argument may be a promise/proxy object
    if (value) {
      const selected = this.options.find((opt) => opt.uri == value.uri);
      if (!selected) {
        // selected value cannot be found in list of options, hence unset selected value
        this.selectValue(null);
      }
    }
  }

  @action
  selectValue(selected) {
    this.args.onSelectionChange(selected);
  }
}
