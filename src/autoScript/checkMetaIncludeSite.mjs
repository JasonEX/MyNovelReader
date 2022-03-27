// 检查 meta.js 中的 @include 网站是否有效，无效则清除

import path from 'path'
import fs from 'fs'
import fetch from 'node-fetch'
import dayjs from 'dayjs'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const metaFilePath = path.join(__dirname,'../MyNovelReader/meta.js')

let metaString = fs.readFileSync(metaFilePath).toString()

const siteUrlRegex = /\/\/ @include +\*:\/\/(.*?)\//g

const matchs = metaString.matchAll(siteUrlRegex)

let includeSites = []

for (const match of matchs) {
    includeSites.push(match[1])
}

console.log(
    'these site include *',
    includeSites.filter(e => e.includes('*'))
)

includeSites = includeSites.filter(e => !e.includes('*'))

function escapeRegex(string) {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

async function checkTask(sitesCopy){
    const brokenSites = []
    while (sitesCopy.length) {
        const siteURL = sitesCopy.shift()
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
            const response = await fetch(`http://${siteURL}`, options)
            // if (!(await response.text()).includes('小说')) {
            //     brokenSites.push(siteURL)
            // }
        } catch (e) {
            console.log(e)
            brokenSites.push(siteURL)
        }
    }
    return brokenSites
}

async function main() {
    let taskCount = 16
    const tasks = []
    const sitesCopy = [...includeSites]
    while (taskCount--) {
        const task = checkTask(sitesCopy)
        tasks.push(task)
    }

    const brokenSites = (await Promise.all(tasks)).flat()

    // const metaBackupPath = path.join(__dirname,`/metaBackup/meta-${dayjs().format('YYYY-MM-DD HH.mm.ss')}.js`)
    // fs.writeFileSync(metaBackupPath, metaString)

    for (const siteURL of brokenSites) {
        metaString = metaString.replace(RegExp(`.*${escapeRegex(siteURL)}.*\r\n`, 'g'), '')
    }
    
    console.log(brokenSites)

    fs.writeFileSync(metaFilePath, metaString)
}

main()
