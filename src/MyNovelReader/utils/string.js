function getMiddleStr(str, leftStr, rightStr) {
    var leftIndex = str.indexOf(leftStr) + leftStr.length
    var rightIndex = str.indexOf(rightStr, leftIndex)
    if (leftIndex > -1 && rightIndex > -1) {
        return str.substring(leftIndex, rightIndex)
    } else {
        return ''
    }
}

export default getMiddleStr
