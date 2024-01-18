import { helper } from '@ember/component/helper';
import { format as formatFn } from 'date-fns/format';
import { parseISO } from 'date-fns/parseISO';
import { isBlank } from '@ember/utils';

export function formatDate([date, format], options) {
  if (isBlank(format)) {
    format = 'dd-MM-yyyy';
    if (options.showTime) {
      format += ' HH:mm:ss';
    }
  }
  if (date) {
    if (typeof date == 'string') {
      return formatFn(parseISO(date), format, options);
    } else {
      return formatFn(date, format, options);
    }
  } else {
    return null;
  }
}

export default helper(formatDate);
