import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { SUPPORTED_LANGUAGES } from 'frontend-price-management/config';
import LangString from 'frontend-price-management/utils/lang-string';

export default class LanguageInputComponent extends Component {
  @tracked wrapperNode;

  get value() {
    return this.args.value || {};
  }

  get content() {
    return this.value.content;
  }

  get language() {
    if (this.args.defaultLanguage) {
      console.assert(
        this.languageOptions.includes(this.args.defaultLanguage),
        `Provided default language ${language} not in languageOptions`
      );
    }
    const language = this.value.language || this.args.defaultLanguage || this.languageOptions[0];
    return language;
  }

  get languageOptions() {
    return this.args.languageOptions || SUPPORTED_LANGUAGES;
  }

  @action
  setWrapperNode(element) {
    this.wrapperNode = element;
  }

  @action
  changeContent(content) {
    this.args.onChange(LangString(content, this.language));
  }

  @action
  changeLanguage(language) {
    this.args.onChange(LangString(this.content, language));
  }

  @action
  focusOut(event) {
    const newFocusedElement = event.relatedTarget;
    if (newFocusedElement && this.wrapperNode.contains(newFocusedElement)) {
      // change of focus inside the language-input component. Nothing should happen.
      event.preventDefault();
    } else {
      // change of focus outside the language-input component, call focusout handler
      this.args.onFocusOut();
    }
  }
}
