import { minify } from 'terser'
import { createFilter } from '@rollup/pluginutils'

export default function compress(opts = {}) {
  const type = opts.type?.toLowerCase() || 'js'
  const filter = createFilter(opts.targets)
  const minifyOpts = {
    mangle: false,
    compress: { defaults: false }
  }
  let transform

  if (type === 'js') {
    transform = async function (code, id) {
      if (filter(id)) {
        return await minify(code, minifyOpts)
      }
    }
  } else if (type === 'json') {
    transform = async function (code, id) {
      if (filter(id)) {
        return JSON.stringify(JSON.parse(code))
      }
    }
  } else {
    throw new Error(`unknown file type ${type}. 未知的文件类型 ${type} 。`)
  }

  return { name: 'compress', transform }
}
