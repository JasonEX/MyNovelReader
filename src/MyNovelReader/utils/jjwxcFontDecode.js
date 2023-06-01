// https://greasyfork.org/scripts/425673-%E6%99%8B%E6%B1%9F%E6%96%87%E5%AD%A6%E5%9F%8E%E9%98%B2%E7%9B%97%E5%AD%97%E7%AC%A6%E8%A7%A3%E7%A0%81/code/%E6%99%8B%E6%B1%9F%E6%96%87%E5%AD%A6%E5%9F%8E%E9%98%B2%E7%9B%97%E5%AD%97%E7%AC%A6%E8%A7%A3%E7%A0%81.js?version=987740

import { C, Request, sleep } from '../lib'

export async function replaceJjwxcCharacter(fontName, inputText) {
  let outputText = inputText
  const jjwxcFontTable = await getJjwxcFontTable(fontName)
  if (jjwxcFontTable) {
    for (const jjwxcCharacter of Object.keys(jjwxcFontTable)) {
      const normalCharacter = jjwxcFontTable[jjwxcCharacter]
      outputText = outputText.replaceAll(jjwxcCharacter, normalCharacter)
    }
    outputText = outputText.replaceAll('\u200c', '')
  }
  return outputText
}

async function getJjwxcFontTable(fontName) {
  return await fetchRemoteFont(fontName)
}

async function fetchRemoteFont(fontName) {
  const url = `https://jjwxc.bgme.bid/${fontName}.json`
  const options = { url, method: 'GET' }
  let retry = 3
  let resp

  C.info(`[jjwxc-font]开始请求远程字体对照表 ${fontName}`)

  while (retry--) {
    try {
      resp = await Request(options)
      break
    } catch (e) {
      await sleep(3000)
      C.error(e)
    }
  }

  if (!resp || resp.status !== 200) {
    C.info(`[jjwxc-font]远程字体对照表 ${fontName} 下载失败`)
    return
  }

  try {
    const table = JSON.parse(resp.responseText)
    C.info(`[jjwxc-font]远程字体对照表 ${fontName} 下载成功`)
    return table
  } catch (error) {
    C.error(error)
    C.info(`[jjwxc-font]远程字体对照表 ${fontName} 下载失败`)
  }
}
