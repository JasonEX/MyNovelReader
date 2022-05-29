// 正文内容标准化替换

import { toRE } from '../lib'
import Setting from '../Setting'

function generateNormalizeMap(params) {
  return [
    ['[,，]\\s*|\\s^，', '，'], // 合并每一行以"，"结束的段落
    ['\\. *$', '。'],
    ['([。！？”]) +', '$1'],
    ['，+', '，'],
    ['"(.*?)"', '“$1”'],
    ['”“', '”\n“'], // 将一段中的相邻的对话分段
    [
      // 将一段中的含多个句号、感叹号、问号的句子每句分为多段
      '([。！？])([\\u4e00-\\u9fa5“])',
      '$1\n$2'
    ],
    [
      // 将一段中的第一句后接对话（引号）句子的第一句话分段
      '(^.*?[.。])(“.*?”)',
      '$1\n$2'
    ],
    [
      // 将一段中的右引号后面的内容分为一段
      '([。！？])”([\\u4e00-\\u9fa5“])',
      '$1”\n$2'
    ],
    Setting.mergeQoutesContent
      ? [
          // 将引号内的内容合并为一行
          '“([\\s\\S]*?)”',
          match => match.replaceAll('\n', '')
        ]
      : undefined,
    ['「(.*?)」', '“$1”'],
    ['『(.)』', '$1'],
    ['!', '！'],
    ['[┅。…·]{3,20}', '……'],
    ['[~－]{3,50}', '——']
  ].filter(row => !!row)
}

let replaceNormalizeMap = null

// 不转换 ，？：；（）！
const excludeCharCode = new Set([
  65292, 65311, 65306, 65307, 65288, 65289, 65281
])

// 全角转半角
function toCDB(str) {
  let tmp = '',
    charCode
  for (let i = 0; i < str.length; i++) {
    charCode = str.charCodeAt(i)
    if (
      charCode > 65248 &&
      charCode < 65375 &&
      !excludeCharCode.has(charCode)
    ) {
      tmp += String.fromCharCode(charCode - 65248)
    } else {
      tmp += str.charAt(i)
    }
  }
  return tmp
}

function replaceNormalize(text) {
  if (!replaceNormalizeMap) replaceNormalizeMap = generateNormalizeMap()
  for (const [key, value] of replaceNormalizeMap) {
    text = text.replace(toRE(key), value)
  }
  return text
}

export { replaceNormalize, toCDB }
