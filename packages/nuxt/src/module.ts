import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { defineNuxtModule, addPlugin, isNuxt3 } from '@nuxt/kit'

export interface ModuleOptions {
  addPlugin: Boolean
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'pinia-orm',
    configKey: 'piniaOrm',
  },
  defaults: {
    addPlugin: true,
  },
  setup(options, nuxt) {
    if (options.addPlugin) {
      const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))
      nuxt.options.build.transpile.push(runtimeDir)
      addPlugin(resolve(runtimeDir, isNuxt3() ? 'plugin' : 'nuxt2-plugin'), {
        append: true,
      })
    }
  },
})
