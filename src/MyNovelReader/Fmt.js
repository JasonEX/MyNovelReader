import { toRE } from './lib'

const r = String.raw

const spaceRegex = toRE(r`&nbsp;|&ensp;|&emsp;`),
  noPrintRegex = toRE(r`&thinsp;|&zwnj;|&zwj;`),
  wrapHtmlRegex = toRE(r`</?(?:div|p|br|hr|h\d|article|dd|dl)[^>]*>`),
  commentRegex = toRE(r`<!--[^>]*-->`),
  indent1Regex = toRE(r`\s*\n+\s*`),
  indent2Regex = toRE(r`^[\n\s]+`),
  lastRegex = toRE(r`[\n\s]+$`),
  otherHtmlRegex = toRE(r`</?[a-zA-Z]+(?=[ >])[^<>]*>`)

export function htmlFmt(text, otherRegex = otherHtmlRegex) {
  text = text.replace(toRE('\ufeff'), '')
  text = text.replace(toRE('\u200b'), '')
  text = text.replace(spaceRegex, ' ')
  text = text.replace(noPrintRegex, '')
  text = text.replace(wrapHtmlRegex, '\n')
  text = text.replace(commentRegex, '')
  text = text.replace(otherRegex, '')
  text = text.replace(indent1Regex, '\n')
  text = text.replace(indent2Regex, '')
  text = text.replace(lastRegex, '')

  return text
}
