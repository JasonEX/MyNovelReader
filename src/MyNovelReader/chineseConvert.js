import Setting from './Setting'
import { tw2cn, cn2tw } from './cjk-conv'

export function chineseConversion(text) {
  switch (Setting.chineseConversion) {
    case 'disable':
      return text
    case 'to-cn':
      return tw2cn(text)
    case 'to-tw':
      return cn2tw(text)
    default:
      break
  }
}
