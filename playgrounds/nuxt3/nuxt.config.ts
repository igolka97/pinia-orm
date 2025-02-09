import { defineNuxtConfig } from 'nuxt3'

export default defineNuxtConfig({
  buildModules: ['@pinia/nuxt'],
  modules: ['@pinia-orm/nuxt'],
  // See https://github.com/nuxt/framework/issues/2371
  nitro: {
    externals: {
      inline: ['uuid'],
    },
  },
})
