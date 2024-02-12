import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { isPresent } from '@ember/utils';
import { SUPPORTED_LANGUAGES } from 'frontend-price-management/config';

// https://youmightnotneed.com/lodash/#without
// eslint-disable-next-line
const without = (arr, ...args) => arr.filter(item => !args.includes(item))

/*
 * Due to the nature of language support in rdf (and the mu-cl-resources implementation),
 * it is impossible to make a distinction between `lang-string-set`'s for properties that
 * have a 1-1 cardinality (but with translations provided) and properties that
 * have a 1-n cardinality (with translations provided as well).
 * This component caters specifically for those properties that are `lang-string-set`'s but
 * with a 1-1 cardinality from a semantic perspective. One could also say, this component
 * offers an interface to provide translations in multiple languages for exactly one string,
 * with the same meaning.
 */
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
