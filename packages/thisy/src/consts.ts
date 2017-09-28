export const META_DATA_KEY = '__thisy__'

export interface Class<Proto> {
  new(...args: any[]): Proto
}

export type MetaData = {
  clazz: Class<any>,
  isUpdater: boolean,
}
