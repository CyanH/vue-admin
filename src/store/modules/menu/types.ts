export interface menuState {
  header: Array<obj>,
  aside: Array<string>,
  fullAside: Array<string>,
  asideCollapse: boolean,
  asideTransition: boolean
}

export interface obj {
  path: string,
  title: string,
  icon?: string,
  iconSvg?: string,
  children?: Array<obj>;
}
