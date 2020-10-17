import { compare } from '@ember/utils';
import { copy } from 'ember-copy';

export default class Snapshot {
  base = null;
  future = null;

  constructor( base ) {
    this.base = copy(base, true);
  }

  stage( object ) {
    this.future = Object.assign( object, {} );
  }

  stageLive( object ) {
    this.future = object;
  }

  commit() {
    this.base = copy(this.future, true);
  }

  anyFieldChanged(fields) {
    for (let field of fields) {
      if (this.fieldChanged(field))
        return true;
    }
    return false;
  }

  fieldChanged(field) {
    if( !this.hasBase ) {
      return false;
    } else if( !this.hasStaging ) {
      return this.futureOrEmpty.hasOwnProperty(field);
    } else {
      return compare(this.base[field], this.future[field]) !== 0;
    }
  }

  get hasBase() {
    return this.base && true;
  }

  get hasStaging() {
    return this.future && true;
  }

  get committed() {
    return this.base;
  }

  get baseOrEmpty() {
    return this.base || {};
  }

  get futureOrEmpty() {
    return this.future || {};
  }
}
