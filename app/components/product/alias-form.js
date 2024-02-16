import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { isPresent } from '@ember/utils';
import { without } from 'frontend-price-management/utils/array';

export default class AliasFormComponent extends Component {
  @tracked newAlias;

  get newAliasIsValid() {
    return isPresent(this.newAlias);
  }

  @action
  addAlias(event) {
    event.preventDefault();
    if (this.newAlias) {
      const aliases = this.args.aliases.slice();
      aliases.push(this.newAlias);
      this.args.onChange(aliases);
      this.newAlias = '';
    }
  }

  @action
  removeAlias(alias) {
    const remainingAliases = without(this.args.aliases, alias);
    this.args.onChange(remainingAliases);
  }
}
