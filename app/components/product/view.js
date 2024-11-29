import Component from '@glimmer/component';
import { trackedFunction } from 'reactiveweb/function';
import { SUPPORTED_LANGUAGES } from '../../config';

export default class ProductViewComponent extends Component {
  SUPPORTED_LANGUAGES = SUPPORTED_LANGUAGES;

  imageAttachments = trackedFunction(this, async () => {
    const attachments = await this.args.model.attachments;
    return attachments.filter((attachment) => attachment.isImage);
  });
}
