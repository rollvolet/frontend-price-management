import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { isPresent } from '@ember/utils';
import { SUPPORTED_LANGUAGES } from 'frontend-price-management/config';

// https://youmightnotneed.com/lodash/#without
// eslint-disable-next-line
const without = (arr, ...args) => arr.filter(item => !args.includes(item))

export default class MultiLanguageInputComponent extends Component {
  @tracked newLangString;

  get newLangStringIsValid() {
    return isPresent(this.newLangString);
  }

  get alreadyUsedLanguages() {
    return this.args.values.map((v) => v.language);
  }

  get availableLanguages() {
    return SUPPORTED_LANGUAGES.filter((l) => !this.alreadyUsedLanguages.includes(l));
  }

  @action
  addLangString(newLangString) {
    if (newLangString) {
      const values = this.args.values.slice();
      values.push(newLangString);
      this.args.onChange(values);
      this.newLangString = '';
    }
  }

  @action
  removeLangString(langString) {
    const remainingLangStrings = without(this.args.values, langString);
    this.args.onChange(remainingLangStrings);
  }
}
