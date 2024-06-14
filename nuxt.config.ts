// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  },
  build: {
    postcss: {
      postcssOptions: {
        plugins: {
          tailwindcss: {},
          autoprefixer: {},
        },
      },
    },
  },
  css: [
    '~/assets/scss/_main.scss',
    '~/assets/css/tailwind.css'
  ],
  routeRules: {
    '/api/**': {
      proxy: {
        to: 'http://127.0.0.1:5000/api/',
      }
    }
  },
  axios: {
    proxy: true,
    baseURL: '/'
  }
})
