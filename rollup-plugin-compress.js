import { minify } from 'terser'
import { resolve } from 'path'

export default function compress(options = {}) {
  const { targets } = options
  return {
    name: 'compress',
    async transform(code, id) {
      for (const target of targets) {
        if (id === resolve(target)) {
          return await minify(code, {
            mangle: false,
            compress: { defaults: false }
          })
        }
      }
    }
  }
}
