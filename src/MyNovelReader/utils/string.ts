function getMiddleStr(str: string, leftStr: string, rightStr: string): string {
    const leftIndex = str.indexOf(leftStr) + leftStr.length;
    const rightIndex = str.indexOf(rightStr, leftIndex);
    if (leftIndex > -1 && rightIndex > -1) {
        return str.substring(leftIndex, rightIndex);
    } else {
        return '';
    }
}

export default getMiddleStr;
