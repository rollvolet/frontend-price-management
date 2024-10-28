import Component from '@glimmer/component';
import { SUPPORTED_LANGUAGES } from '../../config';

export default class ProductViewComponent extends Component {
  SUPPORTED_LANGUAGES = SUPPORTED_LANGUAGES;

  get imageAttachments() {
    return this.args.model
      .hasMany('attachments')
      .value()
      ?.filter((a) => a.isImage);
  }
}
