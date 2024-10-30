import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { guidFor } from '@ember/object/internals';
import { keepLatestTask } from 'ember-concurrency';
import { compare } from '@ember/utils';

export default class InputUnitCodeSelectComponent extends Component {
  @service store;

  @tracked options = [];
  @tracked selected;

  constructor() {
    super(...arguments);
    this.loadData.perform();
  }

  loadData = keepLatestTask(async () => {
    this.options = this.store
      .peekAll('unit-code')
      .slice(0)
      .sort((a, b) => compare(a.label, b.label));

    const value = await this.args.value; // argument may be a promise/proxy object
    if (value) {
      const selected = this.options.find((opt) => opt.uri == value.uri);
      if (!selected) {
        // selected value cannot be found in list of options, hence unset selected value
        this.args.onSelectionChange(null);
      }
    }
  });

  get fieldId() {
    return `unit-code-select-${guidFor(this)}`;
  }
}
