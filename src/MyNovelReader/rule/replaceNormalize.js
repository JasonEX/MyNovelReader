// 正文内容标准化替换

const replaceNormalize = {
    ',\\s*': '，',
    '\\.$': '。',
    '，$\\s|\\s^，': '，',
    '，+': '，',
    '。([^\s”"])': '。\n$1',
    '。{3,7}': '……',
    '~{2,50}': '——',
    '…{3,40}': '……',
    '－{3,20}': '——',
}

// 不转换 ，？：；（）！
const excludeCharCode = new Set([65292, 65311, 65306, 65307, 65288, 65289, 65281])

// 全角转半角
function toCDB(str) {
    let tmp = '', charCode;
    for (let i = 0; i < str.length; i++) {
        charCode = str.charCodeAt(i)
        if (charCode > 65248 && charCode < 65375 && !excludeCharCode.has(charCode)) {
            tmp += String.fromCharCode(charCode - 65248)
        } else {
            tmp += String.fromCharCode(charCode)
        }
    }
    return tmp
}

export { replaceNormalize, toCDB }
