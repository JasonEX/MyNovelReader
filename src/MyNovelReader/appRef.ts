// 共享 App 引用，用于解决循环依赖
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _app: any = null;

export function setApp(app: any): void {
  _app = app;
}

export function getApp(): any {
  return _app;
}
