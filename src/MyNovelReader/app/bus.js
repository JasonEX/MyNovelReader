import mitt from 'mitt'

const bus = mitt()

// 显示 语音朗读 对话框
export const SHOW_SPEECH = 'show-speech'

export const APPEND_NEXT_PAGE = 'appended_next_page'

export default bus