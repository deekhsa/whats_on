// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/google-fonts',
    '@nuxt/ui',
    '@pinia/nuxt',
    'nuxt-lodash'
  ],
  googleFonts: {
    families: {
      Raleway: true,
    },
  },
  ui: {
    global: true,
    safelistColors: [
      "secondary",
      "box-secondary",
      "header"
    ],
  },

  compatibilityDate: '2025-02-18'
})