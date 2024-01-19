import Model, { attr } from '@ember-data/model';

export default class LanguageModel extends Model {
  @attr('string') uri;
  @attr('string') name;
}
