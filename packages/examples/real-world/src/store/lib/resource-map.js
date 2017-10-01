import KeyNormalizable from '../../lib/key-normalizable';
import { normalizeKey } from './normalizers';

export default class ResourceMap extends KeyNormalizable {
  constructor() {
    super(normalizeKey);
  }
}
