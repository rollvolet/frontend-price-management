import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { isPresent } from '@ember/utils';

export default class AliasFormComponent extends Component {
  @tracked newAlias;

  get newAliasIsValid() {
    return isPresent(this.newAlias);
  }

  @action
  addAlias(newAlias) {
    if (newAlias) {
      this.args.onChange(this.args.aliases.slice().addObject(newAlias));
      this.newAlias = '';
    }
  }

  @action
  removeAlias(alias) {
    const remainingAliases = this.args.aliases.slice().removeObject(alias);
    this.args.onChange(remainingAliases);
  }

}
