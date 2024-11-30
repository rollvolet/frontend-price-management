import Component from '@glimmer/component';

export default class FmtUnitCodeComponent extends Component {
  get label() {
    if (typeof this.args.value === 'string') {
      return this.args.value;
    } else {
      // ED unitPrice object
      return this.args.value?.get('label');
    }
  }
  get htmlLabel() {
    if (this.label == 'm1') {
      return 'm';
    } else if (this.label == 'm2') {
      return 'm<sup>2</sup>';
    } else if (this.alabel == 'st') {
      return 'stuk';
    } else {
      return this.label;
    }
  }
}
