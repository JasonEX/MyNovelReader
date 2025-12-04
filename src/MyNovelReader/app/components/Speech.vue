<template>
  <div class="speech">
    <span v-if="playState == STATE.playing">
      <button @click="pause">暂停朗读</button>
      <button @click="stop">停止朗读</button>
    </span>
    <span v-else>
      <button @click="start" v-if="playState == STATE.stoping">开始朗读</button>
      <button @click="resume" v-if="playState == STATE.pausing">继续朗读</button>
      <span v-if="elapsedTime">已朗读 {{ formatMillisencod(elapsedTime) }}</span>
      <span v-else class="tips">Tips: 可从选择文本处开始朗读</span>
      <button class="close-btn" @click="closeSpeech">X</button>
    </span>

    <div class="loader" v-if="playState == STATE.playing">
      <pulse-loader></pulse-loader>
    </div>
    <div v-else>
      <div>
        <label><input type="radio" v-model="autoStop" value="time" />
          定时朗读：
          <input type="text" v-model="autoStopTime" class="auto-stop-input" />
          <select v-model="autoStopTimeUnit">
            <option value="minute">分钟</option>
            <option value="hour">小时</option>
          </select>
          后停止
        </label><br>
        <label><input type="radio" v-model="autoStop" value="chapter" />
          定章朗读：
          <input type="text" v-model="autoStopChapter" class="auto-stop-input" />章后停止
        </label><br>
        <label><input type="radio" v-model="autoStop" value="" />一直朗读</label>
      </div>
      <div>
        <label for="speech-dialog-rate">语速</label>
        <input type="range" min="0.5" max="3" step="0.1" id="speech-dialog-rate" v-model="rate" />
        <span class="rate-value">{{ rate }}</span>
      </div>
      <div>
        <label for="speech-dialog-pitch">音高</label>
        <input type="range" min="0" max="2" step="0.1" id="speech-dialog-pitch" v-model="pitch" />
        <span class="pitch-value">{{ pitch }}</span>
      </div>
      <div>
        <select class="voices" v-model="selectedVoice">
          <option v-for="(voice, index) in voiceList" :value="index" :key="index">
            {{ voice.name }} {{ voice.lang }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import PulseLoader from '../../../common/components/spinner/PulseLoader.vue'
import oldApp from '../../app.js'
import bus, { APPEND_NEXT_PAGE } from '../bus.js'
import { locations, formatMillisencod } from '../../utils'

const STATE = {
  playing: 1,
  pausing: 2,
  stoping: 0,
}

// 响应式数据
const emit = defineEmits(['closeSpeech'])
const text = ref('')
const playState = ref(STATE.stoping)  // 监控朗读的状态
const isPlaying = ref(false)  // 按钮的状态
const elapsedTime = ref(0)

const voiceList = ref([])
const selectedVoice = ref(0)
const rate = ref(1)
const pitch = ref(1)

const autoStop = ref('')
const autoStopTime = ref(2)  // 2 小时
const autoStopTimeUnit = ref('hour')
const autoStopChapter = ref(5)  // 5章

const synth = window.speechSynthesis
const utterance = ref(new SpeechSynthesisUtterance())

// 非响应式变量
let speakIndex = 0
let startSpeakIndex = 0
let isFindingNext = false
let autoStopTimeId = null

// 组件挂载
onMounted(() => {
  // 载入语音列表
  voiceList.value = synth.getVoices()
  synth.onvoiceschanged = () => {
    voiceList.value = synth.getVoices()
  }

  loadSetting()
})

onBeforeUnmount(() => {
  clearTimeout(autoStopTimeId)
  bus.off(APPEND_NEXT_PAGE, waitForNext)
})

// 方法
const closeSpeech = () => {
  emit('closeSpeech')
}

const loadSetting = () => {
  rate.value = GM_getValue('speech.rate', 1)
  pitch.value = GM_getValue('speech.pitch', 1)
  selectedVoice.value = GM_getValue('speech.selectedVoice', 0)

  autoStop.value = GM_getValue('speech.autoStop', '')
  autoStopTime.value = GM_getValue('speech.autoStopTime', 2)
  autoStopTimeUnit.value = GM_getValue('speech.autoStopTimeUnit', 'hour')
  autoStopChapter.value = GM_getValue('speech.autoStopChapter', 5)
}

const saveSetting = () => {
  GM_setValue('speech.rate', rate.value)
  GM_setValue('speech.pitch', pitch.value)
  GM_setValue('speech.selectedVoice', selectedVoice.value)

  GM_setValue('speech.autoStop', autoStop.value)
  GM_setValue('speech.autoStopTime', autoStopTime.value)
  GM_setValue('speech.autoStopTimeUnit', autoStopTimeUnit.value)
  GM_setValue('speech.autoStopChapter', autoStopChapter.value)
}

const start = async () => {
  isPlaying.value = true

  // 获取当前所在的章节
  speakIndex = oldApp.curFocusIndex
  startSpeakIndex = oldApp.curFocusIndex
  let toSpeekText = getToSpeekText(true)

  bus.off(APPEND_NEXT_PAGE, waitForNext)
  bus.on(APPEND_NEXT_PAGE, waitForNext)

  // fix 可能的问题：点击开始朗读无效，需要 cancel 才有效
  window.speechSynthesis.cancel()

  speak(toSpeekText, checkNext)

  if (autoStop.value == 'time') {
    clearTimeout(autoStopTimeId)
    autoStopTimeId = setTimeout(stop, getAutoStopMillisecond())
  }

  // 保存设置
  saveSetting()
}

const getAutoStopMillisecond = () => {
  if (autoStopTimeUnit.value == 'minute') {
    return autoStopTime.value * 60 * 1000
  } else {
    return autoStopTime.value * 3600 * 1000
  }
}

const checkNext = async () => {
  if (!isPlaying.value) return

  speakIndex += 1;
  await checkAgin()
}

const checkAgin = async () => {
  let speakedChapters = speakIndex - startSpeakIndex
  if (autoStop.value == 'chapter' && speakedChapters >= autoStopChapter.value) {
    stop()
    return
  }

  // 是否有新章节
  let nextText = getToSpeekText()
  if (nextText) {
    isFindingNext = false
    speak(nextText, checkNext)

    scrollToNext()
  } else {
    isFindingNext = true
    // 加载下一章
    await oldApp.scrollForce()
  }
}

const waitForNext = async () => {
  if (isFindingNext && isPlaying.value) {
    await checkAgin()
  }
}

const scrollToNext = () => {
  let elem = oldApp.scrollItems.get(speakIndex)
  if (elem) {
    oldApp.scrollToArticle(elem)
  }
}

const getToSpeekText = (fromSelection = false) => {
  let startIndex = speakIndex

  // 这是 jQuery 对象
  let text = oldApp.scrollItems
    .toArray()
    .filter((elem, i) => {
      return i == startIndex
    })
    // .map(elem => elem.textContent.slice(0, 10))  // debug
    .map(elem => elem.textContent)
    .join('\n')

  if (fromSelection) {
    let newText = getSelectionAfterText(text)
    if (newText) {
      return newText
    }
  }

  return text
}

const getSelectionAfterText = (text) => {
  const selObj = getSelection()
  const selStr = selObj.toString()
  let afterText;

  if (!selStr) return

  let indexes = locations(selStr, text)
  if (indexes.length == 0) {
    return
  } else if (indexes.length == 1) {
    afterText = text.substring(indexes[0])
  } else {  // 多个
    indexes = locations(selObj.anchorNode.data, text)
    if (indexes.length == 0) return
    else if (indexes.length == 1) {
      let start = indexes[0] + selObj.anchorOffset
      afterText = text.substring(start)
    } else {
      console.error('getSelectionAfterText() 无法判断唯一')
    }
  }

  selObj.removeAllRanges()
  return afterText
}

const speak = (text, endFn) => {
  utterance.value = new SpeechSynthesisUtterance(text);
  utterance.value.voice = voiceList.value[selectedVoice.value]
  utterance.value.pitch = pitch.value
  utterance.value.rate = rate.value

  listenForSpeechEvents(endFn)

  synth.speak(utterance.value);
}

const listenForSpeechEvents = (endFn) => {
  utterance.value.onstart = () => {
    playState.value = STATE.playing
  }
  utterance.value.onpause = (event) => {
    playState.value = STATE.pausing
    elapsedTime.value = event.elapsedTime
  }
  utterance.value.onresume = (e) => {
    playState.value = STATE.playing
  }
  utterance.value.onend = (event) => {
    playState.value = STATE.stoping
    // elapsedTime.value = event.elapsedTime
    elapsedTime.value = null

    if (endFn) {
      endFn()
    }
  }
}

const pause = () => {
  isPlaying.value = false

  synth.pause()
}

const resume = () => {
  isPlaying.value = true

  synth.resume()
}

const stop = () => {
  isPlaying.value = false

  synth.cancel()

  clearTimeout(autoStopTimeId)
}

// 定义emit
</script>

<style lang="less">
.speech {
  .close-btn {
    position: absolute;
    top: 0;
    right: 0;
  }

  .loader {
    text-align: center;
  }

  .auto-stop-input {
    width: 30px;
  }

  .tips {
    font-size: 0.8em;
  }
}
</style>

