<template>
  <div>
    <div v-if="loader" class="mb-24">
      <ImageBoxSkeleton />
    </div>
    <div v-show="!loader" class="px-6 py-4 relative">
      <div>
        <label class="text-sm uppercase font-medium text-gray-400 block mb-2">Card Information</label>
        <div id="card-number" class="border border-gray-300 p-2 rounded-sm mb-2" />
        <div id="card-expiry" class="border border-gray-300 p-2 rounded-sm mb-2" />
        <div id="card-cvc" class="border border-gray-300 p-2 rounded-sm mb-2" />
        <div id="card-error" class="text-red-400 text-sm mb-2" />
        <button id="custom-button" class="border border-gray-300 p-2 w-full bg-purple-500 text-white uppercase" @click="createToken">
          Pay Now
        </button>
      </div>
    </div>
    <div v-if="chargingStripe" class="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-secondary opacity-70 flex flex-col items-center justify-center">
      <div class="lds-ellipsis">
        <div /><div /><div /><div />
      </div>
      <h2 class="text-center text-white text-2xl 2xl:text-3xl font-bold uppercase">
        Please wait
      </h2>
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
      loader: true,
      token: null,
      cardNumber: null,
      cardExpiry: null,
      cardCvc: null,
      chargeData: {
        name: '',
        email: '',
        currency: 'GBP',
        amount: 0,
        stripeToken: null
      },
      chargingStripe: false
    }
  },
  computed: {
    ...paymentModule.mapGetters(['GET_PAYMENT_DETAILS']),
    ...cartModule.mapGetters(['GET_CART']),
    stripeElements () {
      return this.$stripe.elements()
    }
  },
  async mounted () {
    this.loader = true
    await this.setupStripe()
    setTimeout(() => {
      this.loader = false
      this.$emit('update:isPaymentLoading', false)
    }, 5000)
    this.setCustomerDetails()
  },
  beforeDestroy () {
    this.destroyStripe()
  },
  methods: {
    ...paymentModule.mapActions(['CHARGE_STRIPE']),
    async createToken () {
      this.chargingStripe = true
      this.setPaymentDetails()
      document.getElementById('card-error').innerHTML = ''
      const { token, error } = await this.$stripe.createToken(this.cardNumber)
      if (error) {
        document.getElementById('card-error').innerHTML = error.message
        this.chargingStripe = false
        return
      }
      this.chargeData.stripeToken = token.id
      const resp = await this.CHARGE_STRIPE(this.chargeData)
      if (resp && resp.data && resp.data.request.status === 'succeeded') {
        this.$router.push('/confirmation?status=COMPLETED')
      } else {
        // console.log('Something went wrong!')
      }
      this.chargingStripe = false
    },
    async setupStripe () {
      // Style Object documentation here: https://stripe.com/docs/js/appendix/style
      const style = {
        base: {
          color: 'black',
          fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
          fontSmoothing: 'antialiased',
          fontSize: '14px',
          '::placeholder': {
            color: '#aab7c4'
          }
        },
        invalid: {
          color: '#fa755a',
          iconColor: '#fa755a'
        }
      }
      this.cardNumber = await this.stripeElements.create('cardNumber', { style })
      await this.cardNumber.mount('#card-number')
      this.cardExpiry = await this.stripeElements.create('cardExpiry', { style })
      await this.cardExpiry.mount('#card-expiry')
      this.cardCvc = await this.stripeElements.create('cardCvc', { style })
      await this.cardCvc.mount('#card-cvc')
    },
    destroyStripe () {
      this.cardNumber.destroy()
      this.cardExpiry.destroy()
      this.cardCvc.destroy()
    },
    setPaymentDetails () {
      if (this.GET_PAYMENT_DETAILS.paid_full) {
        this.chargeData.amount = this.GET_CART.subTotal
      } else {
        this.chargeData.amount = this.GET_PAYMENT_DETAILS.advance_amount
      }
    },
    setCustomerDetails () {
      let customerDetail = localStorage.getItem('DD_CUSTOMER_DETAIL')
      if (customerDetail) {
        customerDetail = JSON.parse(customerDetail)
        this.chargeData.name = customerDetail.firstname + ' ' + customerDetail.lastname
        this.chargeData.email = customerDetail.email
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.lds-ellipsis {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-ellipsis div {
  position: absolute;
  top: 33px;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: #fff;
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}
.lds-ellipsis div:nth-child(1) {
  left: 8px;
  animation: lds-ellipsis1 0.6s infinite;
}
.lds-ellipsis div:nth-child(2) {
  left: 8px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(3) {
  left: 32px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(4) {
  left: 56px;
  animation: lds-ellipsis3 0.6s infinite;
}
@keyframes lds-ellipsis1 {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes lds-ellipsis3 {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
@keyframes lds-ellipsis2 {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(24px, 0);
  }
}

</style>
