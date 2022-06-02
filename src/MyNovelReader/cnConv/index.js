import Setting from '../Setting'
import { strtr } from './strtr'
import { cn2twTable, tw2cnTable } from './zhConversion.min'

export function chineseConversion(text) {
  switch (Setting.chineseConversion) {
    case 'disable':
      return text
    case 'to-cn':
      return strtr(text, tw2cnTable)
    case 'to-tw':
      return strtr(text, cn2twTable)
    default:
      break
  }
}
