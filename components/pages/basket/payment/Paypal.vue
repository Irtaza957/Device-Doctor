<template>
  <div>
    <div ref="paypal" class="mb-24" />
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
    return {}
  },
  computed: {
    ...paymentModule.mapState(['PAYMENT_DETAILS']),
    ...paymentModule.mapGetters(['GET_PAYMENT_DETAILS']),
    ...cartModule.mapGetters(['GET_CART'])
  },
  mounted () {
    this.mountPayPal()
    this.$emit('update:isPaymentLoading', false)
  },
  methods: {
    mountPayPal () {
      if (this.GET_PAYMENT_DETAILS.paid_full) {
        this.loadPayPal(this.GET_CART.subTotal)
      } else {
        this.loadPayPal(this.GET_PAYMENT_DETAILS.advance_amount)
      }
    },
    loadPayPal (price) {
      window.paypal.Buttons({

        style: {
          layout: 'horizontal',
          color: 'blue',
          shape: 'pill',
          label: 'paypal'
        },

        createOrder (data, actions) {
          return actions.order.create({
            purchase_units: [{
              // description: '',
              amount: {
                currency_code: 'GBP',
                value: price
              }
            }]
          })
        },

        // Finalize the transaction after payer approval
        onApprove (data, actions) {
          return actions.order.capture().then(function (orderData) {
            // console.log('Capture result', orderData, JSON.stringify(orderData, null, 2))
            const transaction = orderData.purchase_units[0].payments.captures[0]
            if (transaction.status === 'COMPLETED') {
              // actions.redirect('/confirmation?status=COMPLETED')
              window.location = '/confirmation?status=COMPLETED'
            } else {
              // Handle Error here
            }
          })
        }
        // onError: (err) => {
        //   console.log(err)
        // }
      }).render(this.$refs.paypal)
    }
  }
}
</script>
