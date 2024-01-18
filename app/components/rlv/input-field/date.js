import Component from '@glimmer/component';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';

export default class RlvInputFieldDateComponent extends Component {
  get fieldId() {
    return `date-input-${guidFor(this)}`;
  }

  @action
  updateValue(dates) {
    const date = unlocalize(dates[0]);
    this.args.onChange(date);
  }
}

function unlocalize(localizedDate) {
  if (localizedDate) {
    return new Date(
      Date.UTC(localizedDate.getFullYear(), localizedDate.getMonth(), localizedDate.getDate())
    );
  } else {
    return null;
  }
}
