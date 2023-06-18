import { Environment } from './config.js'
const appEnv = process.env.NODE_ENV || 'development'

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  env: {
    BASE_URL: Environment[appEnv].BASE_URL,
    BROWSER_BASE_URL: Environment[appEnv].BROWSER_BASE_URL,
    STRIPE_PUBLISHABLE_KEY: Environment[appEnv].STRIPE_PUBLISHABLE_KEY,
    PAYPAL_CLIENT_ID: Environment[appEnv].PAYPAL_CLIENT_ID,
    GOOGLE_ANALYTICS_ID: Environment[appEnv].GOOGLE_ANALYTICS_ID,
    GOOGLE_SERVICE_ACCOUNT: Environment[appEnv].GOOGLE_SERVICE_ACCOUNT
  },
  ssr: true,
  target: 'static',
  head: {
    title: 'Device Doctors - We come to you for device repairs and support',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/logo.ico' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap'
      }
    ],
    script: [
      // For Hubspot Forms
      { src: 'https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js' },
      { src: `https://www.paypal.com/sdk/js?client-id=${Environment[appEnv].PAYPAL_CLIENT_ID}&disable-funding=credit,card,paylater,bancontact&currency=GBP` },
      { src: 'https://js.stripe.com/v3' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/scss/main.scss',
    'aos/dist/aos.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '@/plugins/aos.js', mode: 'client' },
    { src: '@/plugins/vee-validate.js' },
    { src: '@/plugins/global-components.js' },
    { src: '@/plugins/vue-scroll-loader', mode: 'client' },
    { src: '@/plugins/vue-number-animation.js', mode: 'client' },
    { src: '@/plugins/vue-simple-accordion.js', mode: 'client' },
    { src: '@/plugins/Stripe.js', ssr: false, mode: 'client' }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
    // Simple usage
    '@nuxtjs/moment'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    'cookie-universal-nuxt',
    [
      'nuxt-fontawesome', {
        imports: [
          {
            set: '@fortawesome/free-solid-svg-icons',
            icons: ['fas']
          },
          {
            set: '@fortawesome/free-brands-svg-icons',
            icons: ['fab']
          }
        ]
      }
    ],
    'vue-scrollto/nuxt',
    '@nuxtjs/google-analytics'

  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: Environment[appEnv].BASE_URL, // Used as fallback if no runtime config is provided
    browserBaseUrl: Environment[appEnv].BROWSER_BASE_URL
  },

  googleAnalytics: {
    id: Environment[appEnv].GOOGLE_ANALYTICS_ID
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },

  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: 'tailwind.config.js',
    exposeConfig: false,
    config: {}
  }
}
