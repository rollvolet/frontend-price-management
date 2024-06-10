import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { isPresent } from '@ember/utils';
import { SUPPORTED_LANGUAGES } from 'frontend-price-management/config';
import { without } from 'frontend-price-management/utils/array';

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

  get values() {
    return this.args.values && this.args.values.length > 0 ? this.args.values : [];
  }

  get newLangStringIsValid() {
    return isPresent(this.newLangString);
  }

  get alreadyUsedLanguages() {
    return this.values.map((v) => v.language);
  }

  get availableLanguages() {
    return SUPPORTED_LANGUAGES.filter((l) => !this.alreadyUsedLanguages.includes(l));
  }

  @action
  attemptSubmit(event) {
    event.preventDefault();
    // event bubbles from child input element to the element on which we have
    // this ember event handler ("on"). Need to make the distinction between
    // move of focus to another child element (the language selector) and an external
    // element. We only want to submit on move of focus to external element.
    if (!event.target.form.contains(event.relatedTarget) && this.newLangStringIsValid) {
      this.addLangString(event);
    }
  }

  @action
  addLangString(event) {
    event.preventDefault();
    if (this.newLangString) {
      const values = this.values.slice();
      values.push(this.newLangString);
      this.args.onChange(values);
      this.newLangString = '';
    }
  }

  @action
  setInputElement(element) {
    this.inputElement = element;
    this.inputElement?.focus();
  }

  @action
  removeLangString(langString) {
    const remainingLangStrings = without(this.values, langString);
    this.args.onChange(remainingLangStrings);
  }
}
