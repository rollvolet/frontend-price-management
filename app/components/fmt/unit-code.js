import Component from '@glimmer/component';

export default class FmtUnitCodeComponent extends Component {
  get htmlLabel() {
    if (this.args.value == 'm1') {
      return 'm';
    } else if (this.args.value == 'm2') {
      return 'm<sup>2</sup>';
    } else if (this.args.value == 'st') {
      return 'stuk';
    } else {
      return this.args.value;
    }
  }
}
