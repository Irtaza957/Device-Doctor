<template>
  <div>
    <div v-show="!loader" id="my-checkout-container" />
    <div v-if="loader" class="mb-24">
      <ImageBoxSkeleton />
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const paymentModule = createNamespacedHelpers('payment')
const cartModule = createNamespacedHelpers('cart')
export default {
  props: {
    isPaymentLoading: {
      type: Boolean,
      default: () => true
    }
  },
  data () {
    return {
      loader: false,
      createOrder: {
        purchase_country: 'GB',
        purchase_currency: 'GBP',
        locale: 'en-GB',
        order_amount: 0,
        order_tax_amount: 0,
        type: 'physical',
        reference: 'N/A',
        name: 'All Device',
        quantity: 1,
        quantity_unit: 'pcs',
        unit_price: 0,
        tax_rate: 0,
        total_amount: 0,
        total_discount_amount: 0,
        total_tax_amount: 0
      },
      klarnaResponse: null
    }
  },
  computed: {
    ...cartModule.mapGetters(['GET_CART'])
  },
  async mounted () {
    this.loader = true
    this.createOrder.order_amount = this.GET_CART.subTotal * 100
    this.createOrder.unit_price = this.GET_CART.subTotal * 100
    this.createOrder.total_amount = this.GET_CART.subTotal * 100
    const resp = await this.KLARNA_CREATE_ORDER(this.createOrder)
    this.klarnaResponse = resp.data
    this.runKlarnaScript()
    this.loader = false
    this.$emit('update:isPaymentLoading', false)
  },
  methods: {
    ...paymentModule.mapActions(['KLARNA_CREATE_ORDER']),
    runKlarnaScript () {
      const checkoutContainer = document.getElementById('my-checkout-container')
      if (this.klarnaResponse.request.html_snippet) {
        checkoutContainer.innerHTML = this.klarnaResponse.request.html_snippet.replace(/\\"/g, '"').replace(/\\n/g, '')
        const scriptsTags = checkoutContainer.getElementsByTagName('script')
        for (let i = 0; i < scriptsTags.length; i++) {
          const parentNode = scriptsTags[i].parentNode
          const newScriptTag = document.createElement('script')
          newScriptTag.type = 'text/javascript'
          newScriptTag.text = scriptsTags[i].text
          parentNode.removeChild(scriptsTags[i])
          parentNode.appendChild(newScriptTag)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
