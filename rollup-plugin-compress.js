import { minify } from 'terser'
import { createFilter } from '@rollup/pluginutils'

export default function compress(opts = {}) {
  const filter = createFilter(opts.targets)
  const minifyOpts = {
    mangle: false,
    compress: { defaults: false }
  }

  return {
    name: 'compress',
    async transform(code, id) {
      if (filter(id)) {
        return await minify(code, minifyOpts)
      }
    }
  }
}
