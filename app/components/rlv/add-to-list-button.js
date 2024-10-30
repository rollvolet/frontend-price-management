import Component from '@glimmer/component';
import { task } from 'ember-concurrency';

export default class RlvAddToListButtonComponent extends Component {
  click = task(async (event) => {
    await this.args.onClick(event);
  });
}
