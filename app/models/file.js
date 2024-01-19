import Model, { attr } from '@ember-data/model';

export default class FileModel extends Model {
  @attr('string') filename;
  @attr('string') format;
  @attr('string') size;
  @attr('string') extension;
  @attr('datetime') created;

  get humanReadableSize() {
    const bytes = this.size;
    const sizes = ['bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) {
      return '0 byte';
    } else {
      const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
      return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    }
  }

  get downloadLink() {
    return `/files/${this.id}/download?name=${this.filename}`;
  }
}
