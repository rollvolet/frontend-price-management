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
  attemptSubmit(event) {
    event.preventDefault();
    // event bubbles from child input element to the element on which we have
    // this ember event handler ("on"). Need to make the distinction between
    // move of focus to another child element (the language selector) and an external
    // element. We only want to submit on move of focus to external element.
    if (!event.target.form.contains(event.relatedTarget) && this.newAliasIsValid) {
      this.addAlias(event);
    }
  }

  @action
  addAlias(event) {
    event.preventDefault();
    if (this.newAlias) {
      const aliases = this.args.aliases.slice();
      aliases.push(this.newAlias);
      this.args.onChange(aliases);
      this.newAlias = undefined;
      document.getElementById('new-alias-name').focus();
    }
  }

  @action
  removeAlias(alias) {
    const remainingAliases = without(this.args.aliases, alias);
    this.args.onChange(remainingAliases);
    document.getElementById('new-alias-name').focus();
  }
}
