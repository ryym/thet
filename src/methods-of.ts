import { Class, META_DATA_KEY } from './store'

export default function methodsOf<Proto>(clazz: Class<Proto>): Proto

export default function methodsOf(clazz: any): any {
  return Object.getOwnPropertyNames(clazz.prototype).reduce((ms: any, name) => {
    if (typeof clazz.prototype[name] === 'function') {
      ms[name] = clazz.prototype[name]
      ms[name][META_DATA_KEY] = {
        clazz,
        isUpdater: name[0] === '$' // XXX: For now
      }
    }
    return ms
  }, {})
}
