const routerBase =
  process.env.DEPLOY_ENV === 'GH_PAGES'
    ? {
        router: {
          base: '/overwatch-control-point-bounds/'
        }
      }
    : {};

export default {
  mode: 'spa',
  /*
   ** Headers of the page
   */
  head: {
    title: '', // SPA fix
    titleTemplate: (titleChunk) => {
      return titleChunk
        ? `${titleChunk} - ${process.env.title}`
        : `${process.env.title || 'Overwatch Control Point Bounds'}`; // SPA fix
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Teko|Roboto|Roboto+Condensed|Material+Icons&display=swap'
      }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: '~/components/OwLoadingOverlay.vue',
  /*
   ** Global CSS
   */
  css: ['normalize.css', '~assets/fonts/Metropolis.scss', '~assets/scss/variables.scss', '~assets/scss/global.scss'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    { src: '~/plugins/material-components-vue.ts', mode: 'client' },
    { src: '~/plugins/modernizr.js', mode: 'client' }
    // { src: '~/node_modules/vue-compare-image', mode: 'client' }
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxt/typescript-build'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: ['@bazzite/nuxt-optimized-images'],
  optimizedImages: {
    optimizeImages: true
  },
  /*
   ** Build configuration
   */
  env: {
    title: 'Overwatch Control Point Bounds',
    author_name: process.env.npm_package_author_name,
    author_url: process.env.npm_package_author_url
  },
  build: {
    extractCSS: true,
    /*
     ** You can extend webpack config here
     */
    extend() {},
    loaders: {
      scss: {
        sassOptions: {
          includePaths: ['node_modules']
        }
      }
    }
  },
  server: {
    host: '0.0.0.0'
  },
  layoutTransition: {
    name: 'layout'
  },
  loadingIndicator: '',
  ...routerBase
};
