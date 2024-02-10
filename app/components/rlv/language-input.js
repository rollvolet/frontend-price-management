import Component from '@glimmer/component';
import { action } from '@ember/object';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from 'frontend-price-management/config';
import LangString from 'frontend-price-management/utils/lang-string';

export default class LanguageInputComponent extends Component {
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
  changeContent(content) {
    this.args.onChange(LangString(content, this.language));
  }

  @action
  changeLanguage(language) {
    this.args.onChange(LangString(this.content, language));
  }
}
