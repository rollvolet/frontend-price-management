import { get } from '@ember/object';

// taken from https://github.com/DockYard/ember-composable-helpers/blob/master/addon/helpers/pick.js

export default function pick(path, action) {
  return function (event) {
    let value = get(event, path);

    if (!action) {
      return value;
    }

    action(value);
  };
}
