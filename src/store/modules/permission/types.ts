export interface PermissionState {
  routers: Array<object>,
  addRouters: Array<childrenMap>
}

export interface childrenMap {
  alwaysShow: boolean,
  component: object,
  hidden: boolean,
  meta: object,
  name: string,
  path: string,
  children?: undefined | Array<childrenMap>,
  redirect: string
}
