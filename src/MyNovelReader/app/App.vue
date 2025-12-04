<template>
  <div id="mynovelreader-app">
    <speech class="speech" v-if="speechDialogVisible" v-on:closeSpeech="hideSpeech" />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import bus, { SHOW_SPEECH } from './bus'
import Speech from './components/Speech.vue'

const speechDialogVisible = ref(false)

const showSpeech = () => {
  speechDialogVisible.value = true
}

const hideSpeech = () => {
  speechDialogVisible.value = false
}

onMounted(() => {
  bus.on(SHOW_SPEECH, showSpeech)
})

onBeforeUnmount(() => {
  bus.off(SHOW_SPEECH, showSpeech)
})
</script>

<style lang="less">
.speech {
  position: fixed;
  z-index: 100;
  background-color: white;
  top: 10px;
  right: 35px;
}
</style>
