import { Class, META_DATA_KEY } from './store'

// decorator function
export function markAsUpdater(
  target: any, key: string, { value }: PropertyDescriptor
) {
  if (typeof value === 'function') {
    value[META_DATA_KEY] = { isUpdater: true }
  }
}

export function methodsOf<Proto>(clazz: Class<Proto>): Proto

export function methodsOf(clazz: any): any {
  return Object.getOwnPropertyNames(clazz.prototype).reduce((ms: any, name) => {
    const method = clazz.prototype[name]
    if (typeof method !== 'function' || method.name === 'constructor') {
      return ms
    }

    const meta = Object.assign({
      clazz,
      isUpdater: name[0] === '$' // XXX: For now
    }, method[META_DATA_KEY])

    method[META_DATA_KEY] = meta
    ms[name] = method

    return ms
  }, {})
}
