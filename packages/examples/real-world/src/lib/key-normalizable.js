import merge from 'lodash.merge';

export default class KeyNormalizable {
  constructor(normalizeKey) {
    this._normalizeKey = normalizeKey;
    this._data = {};
  }

  get(key) {
    return this._data[this._normalizeKey(key)];
  }

  set(key, value) {
    this._data[this._normalizeKey(key)] = value;
  }

  update(rawKey, update, notSetValue) {
    const key = this._normalizeKey(rawKey);
    if (! this._data.hasOwnProperty(key)) {
      this._data[key] = notSetValue;
    }
    this._data[key]= update(this._data[key]);
  }

  merge(newData) {
    this._data = merge(this._data, newData);
  }

  toObject() {
    return this._data; // XXX: should copy
  }
}

