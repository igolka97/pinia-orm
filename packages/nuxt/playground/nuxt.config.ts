import { defineNuxtConfig } from 'nuxt3'
import PiniaOrm from '../../nuxt'

export default defineNuxtConfig({
  buildModules: ['@pinia/nuxt'],
  modules: [PiniaOrm],
  // See https://github.com/nuxt/framework/issues/2371
  nitro: {
    externals: {
      inline: ['uuid'],
    },
  },
})
