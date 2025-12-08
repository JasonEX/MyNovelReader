declare module './libdom' {
  export function observeElement(..._args: any[]): any
  export function domMutation(): Promise<any>
  export function htmlFmt(_text: any, _otherRegex?: any): any
  export function cleanHTML(_doc: any): any
  export function renderHTML(_text: any): any
}
