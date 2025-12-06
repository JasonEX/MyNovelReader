// 参考 https://github.com/madrobby/zepto/blob/master/src/detect.js

const ua: string = navigator.userAgent;
const platform: string = navigator.platform;

export const isFirefox: RegExpMatchArray | null = ua.match(/Firefox\/([\d.]+)/);

export const isChrome: RegExpMatchArray | null =
  ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/);

export const isWindows: boolean = /Win\d{2}|Windows/.test(platform);
