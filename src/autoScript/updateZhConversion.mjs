import path from 'path'
import fs from 'fs'
import fetch from 'node-fetch'
import dayjs from 'dayjs'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const zhConversionFilePath = path.join(__dirname, '../MyNovelReader/cnConv/zhConversion.js')

const sourceURL = "https://phabricator.wikimedia.org/source/mediawiki/browse/master/includes/languages/data/ZhConversion.php?view=raw"

const exclude = {
'乾': '干',
'《易乾': '《易乾',
'乾一坛': '乾一坛',
'乾一壇': '乾一坛',
'乾一組': '乾一组',
'乾一组': '乾一组',
'乾上乾下': '乾上乾下',
'乾东': '乾东',
'乾東': '乾东',
'乾为天': '乾为天',
'乾為天': '乾为天',
'乾为阳': '乾为阳',
'乾為陽': '乾为阳',
'乾九': '乾九',
'乾乾': '乾乾',
'乾亨': '乾亨',
'乾仪': '乾仪',
'乾儀': '乾仪',
'乾位': '乾位',
'乾健': '乾健',
'乾健也': '乾健也',
'乾元': '乾元',
'乾光': '乾光',
'乾兴': '乾兴',
'乾興': '乾兴',
'乾冈': '乾冈',
'乾岡': '乾冈',
'乾刘': '乾刘',
'乾劉': '乾刘',
'乾刚': '乾刚',
'乾剛': '乾刚',
'乾务': '乾务',
'乾務': '乾务',
'乾化': '乾化',
'乾卦': '乾卦',
'乾县': '乾县',
'乾縣': '乾县',
'乾台': '乾台',
'乾吉': '乾吉',
'乾启': '乾启',
'乾啟': '乾启',
'乾命': '乾命',
'乾和': '乾和',
'乾嘉': '乾嘉',
'乾图': '乾图',
'乾圖': '乾图',
'乾坤': '乾坤',
'乾城': '乾城',
'乾基': '乾基',
'乾天也': '乾天也',
'乾始': '乾始',
'乾姓': '乾姓',
'乾宁': '乾宁',
'乾寧': '乾宁',
'乾宅': '乾宅',
'乾宇': '乾宇',
'乾安': '乾安',
'乾定': '乾定',
'乾封': '乾封',
'乾居': '乾居',
'乾岗': '乾岗',
'乾崗': '乾岗',
'乾巛': '乾巛',
'乾州': '乾州',
'乾录': '乾录',
'乾錄': '乾录',
'乾律': '乾律',
'乾德': '乾德',
'乾心': '乾心',
'乾忠': '乾忠',
'乾文': '乾文',
'乾断': '乾断',
'乾斷': '乾断',
'乾方': '乾方',
'乾施': '乾施',
'乾旦': '乾旦',
'乾明': '乾明',
'乾昧': '乾昧',
'乾晖': '乾晖',
'乾暉': '乾晖',
'乾景': '乾景',
'乾晷': '乾晷',
'乾曜': '乾曜',
'乾构': '乾构',
'乾構': '乾构',
'乾枢': '乾枢',
'乾樞': '乾枢',
'乾栋': '乾栋',
'乾棟': '乾栋',
'乾步': '乾步',
'乾氏': '乾氏',
'乾沓和': '乾沓和',
'乾沓婆': '乾沓婆',
'乾泉': '乾泉',
'乾淳': '乾淳',
'乾清': '乾清',
'乾渥': '乾渥',
'乾潭': '乾潭',
'乾灵': '乾灵',
'乾靈': '乾灵',
'乾生元': '乾生元',
'乾男': '乾男',
'乾皋': '乾皋',
'乾盛世': '乾盛世',
'乾矢': '乾矢',
'乾祐': '乾祐',
'乾神': '乾神',
'乾穹': '乾穹',
'乾窦': '乾窦',
'乾竇': '乾窦',
'乾竺': '乾竺',
'乾笃': '乾笃',
'乾篤': '乾笃',
'乾符': '乾符',
'乾策': '乾策',
'乾精': '乾精',
'乾紅': '乾红',
'乾红': '乾红',
'乾綱': '乾纲',
'乾纲': '乾纲',
'乾紐': '乾纽',
'乾纽': '乾纽',
'乾絡': '乾络',
'乾络': '乾络',
'乾統': '乾统',
'乾统': '乾统',
'乾維': '乾维',
'乾维': '乾维',
'乾罗': '乾罗',
'乾羅': '乾罗',
'乾花': '乾花',
'乾荫': '乾荫',
'乾蔭': '乾荫',
'乾行': '乾行',
'乾衡': '乾衡',
'乾西': '乾西',
'乾覆': '乾覆',
'乾象': '乾象',
'乾象历': '乾象历',
'乾象歷': '乾象历',
'乾貞': '乾贞',
'乾贞': '乾贞',
'乾貴士': '乾贵士',
'乾贵士': '乾贵士',
'乾貺': '乾贶',
'乾贶': '乾贶',
'乾車': '乾车',
'乾车': '乾车',
'乾軸': '乾轴',
'乾轴': '乾轴',
'乾通': '乾通',
'乾造': '乾造',
'乾道': '乾道',
'乾鉴': '乾鉴',
'乾鑒': '乾鉴',
'乾鈞': '乾钧',
'乾钧': '乾钧',
'乾闥': '乾闼',
'乾闼': '乾闼',
'乾陀': '乾陀',
'乾陵': '乾陵',
'乾隆': '乾隆',
'乾音': '乾音',
'乾顺': '乾顺',
'乾顧': '乾顾',
'乾顾': '乾顾',
'乾風': '乾风',
'乾风': '乾风',
'乾首': '乾首',
'乾馬': '乾马',
'乾马': '乾马',
'乾鵠': '乾鹄',
'乾鹄': '乾鹄',
'乾鵲': '乾鹊',
'乾鹊': '乾鹊',
'乾龍': '乾龙',
'乾龙': '乾龙',
'乾，健也': '乾，健也',
'乾，天也': '乾，天也',
'周易乾': '周易乾',
'坤乾': '坤乾',
'天道为乾': '天道为乾',
'天道為乾': '天道为乾',
'字乾生': '字乾生',
'孙乾': '孙乾',
'孫乾': '孙乾',
'尼乾陀': '尼乾陀',
'康乾': '康乾',
'张法乾': '张法乾',
'張法乾': '张法乾',
'承乾': '承乾',
'旋乾轉坤': '旋乾转坤',
'旋乾转坤': '旋乾转坤',
'易·乾': '易·乾',
'易經·乾': '易经·乾',
'易经·乾': '易经·乾',
'易經乾': '易经乾',
'易经乾': '易经乾',
'曾运乾': '曾运乾',
'曾運乾': '曾运乾',
'朝乾夕惕': '朝乾夕惕',
'李乾德': '李乾德',
'李乾順': '李乾顺',
'李乾顺': '李乾顺',
'王道乾': '王道乾',
'男为乾': '男为乾',
'男為乾': '男为乾',
'男性为乾': '男性为乾',
'男性為乾': '男性为乾',
'萧乾': '萧乾',
'蕭乾': '萧乾',
'蔡孝乾': '蔡孝乾',
'象乾': '象乾',
'郭子乾': '郭子乾',
'阳为乾': '阳为乾',
'陽為乾': '阳为乾',
'陈乾生': '陈乾生',
'陳乾生': '陈乾生',
'陈公乾生': '陈公乾生',
'陳公乾生': '陈公乾生',
'陈遇乾': '陈遇乾',
'陳遇乾': '陈遇乾',
'雍乾': '雍乾',
'顛乾倒坤': '颠乾倒坤',
'黃潤乾': '黄润乾',
'黄润乾': '黄润乾',
'沈默': '沉默',
}

function getMiddleStr(str, leftStr, rightStr) {
    var leftIndex = str.indexOf(leftStr) + leftStr.length
    var rightIndex = str.indexOf(rightStr, leftIndex)
    if (leftIndex > -1 && rightIndex > -1) {
        return str.substring(leftIndex, rightIndex)
    } else {
        return ''
    }
}

async function main() {
    const options = {
        headers: {
            Accept: '*/*',
            'Accept-Encoding': 'utf-8',
            'Accept-Language': 'zh-CN,zh;q=0.8',
            'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.82 Safari/537.36'
        }
    }
    try {
        const response = await fetch(sourceURL, options)
        let source = await response.text()
        source = getMiddleStr(source, "class ZhConversion {\n", "}")
        source = source.replaceAll("public static", "const")
        .replaceAll("[", "{").replaceAll("]", "}")
        .replace(/'(.*?)' => '(.*?)'/g, "'$1': '$2'")
        for (const [key, value] of Object.entries(exclude)) {
            source = source.replaceAll(`'${key}': '${value}',\n`, '')
        }
        source = `// 转换表来自 https://phabricator.wikimedia.org/source/mediawiki/browse/master/includes/languages/data/ZhConversion.php

${source}
export const tw2cnTable = { ...$zh2CN, ...$zh2Hans };
export const cn2twTable = { ...$zh2TW, ...$zh2Hant };
export const cn2hkTable = { ...$zh2HK, ...$zh2Hant };
`
        fs.writeFileSync(zhConversionFilePath, source.replaceAll("\n", "\r\n"))
        console.log(source)
    } catch (e) {
        console.log(e)
    }
}

main()
