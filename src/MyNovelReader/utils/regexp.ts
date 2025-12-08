type RegexCache = Record<string, Record<string, RegExp>>;

const _regexCache: RegexCache = {};

export function toRE(obj: string | RegExp, flag = 'igm'): RegExp {
  if (obj instanceof RegExp) {
    return obj;
  }

  const cached = _regexCache[obj];
  if (cached?.[flag]) {
    const re = cached[flag];
    re.lastIndex = 0;
    return re;
  }

  const re = new RegExp(obj, flag);

  if (cached) {
    cached[flag] = re;
  } else {
    _regexCache[obj] = { [flag]: re };
  }

  return re;
}

export function toReStr(str: string): string {
  // escape special regex characters
  // eslint-disable-next-line no-useless-escape
  return str.replace(/[()\[\]{}|+.,^$?\\*]/g, '\\$&');
}

export function wildcardToRegExpStr(urlstr: string | RegExp): string {
  if (typeof urlstr !== 'string') {
    return urlstr.source;
  }

  const reg = urlstr
    // eslint-disable-next-line no-useless-escape
    .replace(/[()\[\]{}|+.,^$?\\]/g, '\\$&')
    .replace(/\*+/g, str => (str === '*' ? '.*' : '[^/]*'));

  return `^${reg}$`;
}
