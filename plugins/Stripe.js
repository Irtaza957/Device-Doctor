import Vue from 'vue'
import { StripePlugin } from '@vue-stripe/vue-stripe'

const options = {
  pk: process.env.STRIPE_PUBLISHABLE_KEY
  // testMode: true,
//   stripeAccount: process.env.STRIPE_ACCOUNT,
//   apiVersion: process.env.API_VERSION,
//   locale: process.env.LOCALE,
}

Vue.use(StripePlugin, options)
