<template>
  <div>
    <div class="sticky flex justify-between top-0 py-5 z-20">
      <div class="relative w-max">
        <div
          class="relative flex justify-center items-center py-1 px-8 rounded-full border-4 bg-white border-logo-red font-semibold text-base md:text-lg hover:bg-logo-red hover:text-white transition ease-linear duration-300 cursor-pointer z-0"
          @click="$emit('goBack')"
        >
          <font-awesome-icon :icon="['fas', 'angle-left']" class="mr-2" />Back
        </div>
      </div>
    </div>
    <div class="sm:text-2xl text-lg text-center font-semibold text-dark-gray mb-8 ">
      Checkout &amp; Payment
    </div>
    <div class="xl:w-6/12 md:w-9/12 w-full mx-auto border border-light-gray p-6 shadow">
      <div class="flex items-center justify-between">
        <div class="font-semibold text-dark-blue uppercase">
          Repair details
        </div>
      </div>
      <div class="my-6">
        <h3 class="mb-2 text-sm font-semibold uppercase">
          Repair location
        </h3>
        <p v-if="customerDetail" class="text-xs leading-6 tracking-wide font-normal">
          {{ customerDetail.address1 || '' }}
          {{ customerDetail.address2 ? `, ${customerDetail.address2}` : '' }}
          {{ customerDetail.postcode ? `, ${customerDetail.postcode}` : '' }}
        </p>
      </div>
      <div class="my-6">
        <h3 class="mb-2 text-sm font-semibold uppercase">
          Repair date
        </h3>
        <p v-if="repairDate" class="text-sm leading-6 tracking-wide font-normal">
          {{ repairDate }}
        </p>
      </div>
      <div class="my-6">
        <h3 class="mb-2 text-sm font-semibold uppercase">
          Timeslot
        </h3>
        <p class="text-xs leading-6 tracking-wide font-normal">
          We will send a 2 hour time window the evening before your selected repair date letting you know when we will be with you.
        </p>
      </div>
    </div>
    <!-- Basket -->
    <div class="xl:w-6/12 md:w-9/12 w-full mx-auto mt-8">
      <h2 class="text-center sm:text-2xl text-lg font-semibold text-dark-blue mb-8">
        Your Basket
      </h2>
      <Basket />
    </div>
    <div class="xl:w-6/12 md:w-9/12 w-full mx-auto mt-8">
      <div class="flex justify-between font-semibold text-dark-blue">
        <p>Total (including discount)</p>
        <p>&#163;{{ GET_CART.subTotal }}</p>
      </div>
    </div>
    <!-- Pay Full or Pay 19 -->
    <div
      class="xl:w-6/12 md:w-9/12 w-full mx-auto relative border-2 px-6 cursor-pointer py-2 uppercase shadow mt-8"
      :class="GET_PAYMENT_DETAILS.paid_full ? ' border-logo-red' : ' border-light-gray'"
      @click="changePayFull(true)"
    >
      Pay Full
      <div v-if="GET_PAYMENT_DETAILS.paid_full" class="absolute top-1/2 right-5 transform -translate-y-1/2">
        <font-awesome-icon :icon="['fas','check']" />
      </div>
    </div>
    <template v-if="GET_CART.subTotal > 20">
      <div
        class="xl:w-6/12 md:w-9/12 w-full mx-auto relative border-2 px-6 cursor-pointer py-2 uppercase shadow my-2"
        :class="!GET_PAYMENT_DETAILS.paid_full ? ' border-logo-red' : ' border-light-gray'"
        @click="changePayFull(false)"
      >
        Pay &#163;19
        <div v-if="!GET_PAYMENT_DETAILS.paid_full" class="absolute top-1/2 right-5 transform -translate-y-1/2">
          <font-awesome-icon :icon="['fas','check']" />
        </div>
      </div>
    </template>
    <!-- Payment Methods -->
    <div class="xl:w-6/12 md:w-9/12 w-full mx-auto flex flex-row gap-5 my-8">
      <div
        class="border-gray-300 border-2 py-2 rounded-md cursor-pointer flex-1 flex justify-center items-center"
        :class="[GET_PAYMENT_DETAILS.payment_type === 'Stripe' ? ' border-logo-red' : ' border-light-gray', isPaymentLoading ? 'cursor-not-allowed':'']"
        @click="!isPaymentLoading && changePaymentMethod('Stripe')"
      >
        <div class="p-1 md:p-5">
          <img src="@/assets/img/checkout/stripe.jpeg" class="w-full h-auto" alt="visa">
        </div>
      </div>
      <div
        class="border-gray-300 border-2 py-2 rounded-md cursor-pointer flex-1 flex justify-center items-center"
        :class="[GET_PAYMENT_DETAILS.payment_type === 'PayPal' ? ' border-logo-red' : ' border-light-gray', isPaymentLoading ? 'cursor-not-allowed':'']"
        @click="!isPaymentLoading && changePaymentMethod('PayPal')"
      >
        <div class="p-1 md:p-5">
          <img src="@/assets/img/checkout/paypal.svg" class="w-full h-auto" alt="paypal">
        </div>
      </div>
      <div
        v-if="GET_PAYMENT_DETAILS.paid_full"
        class="border-gray-300 border-2 py-2 rounded-md cursor-pointer flex-1 flex justify-center items-center"
        :class="[GET_PAYMENT_DETAILS.payment_type === 'Klarna' ? ' border-logo-red' : ' border-light-gray', isPaymentLoading ? 'cursor-not-allowed':'']"
        @click="!isPaymentLoading && changePaymentMethod('Klarna')"
      >
        <div class="p-1 md:p-5">
          <img src="@/assets/img/checkout/klarna.jpeg" class="w-full h-auto" alt="klarna">
        </div>
      </div>
    </div>

    <!-- Checkout -->
    <div
      class="xl:w-6/12 md:w-9/12 w-full mx-auto relative my-2"
    >
      <div v-if="GET_PAYMENT_DETAILS.payment_type === 'Stripe'">
        <Stripe :is-payment-loading.sync="isPaymentLoading" />
      </div>
      <div v-else-if="GET_PAYMENT_DETAILS.payment_type === 'PayPal'">
        <Paypal :is-payment-loading.sync="isPaymentLoading" />
      </div>
      <div v-else-if="GET_PAYMENT_DETAILS.payment_type === 'Klarna'">
        <Klarna :is-payment-loading.sync="isPaymentLoading" />
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import Paypal from '@/components/pages/basket/payment/Paypal.vue'
import Stripe from '@/components/pages/basket/payment/Stripe.vue'
import Klarna from '@/components/pages/basket/payment/Klarna.vue'
import Basket from '@/components/pages/basket/common/Basket.vue'
const paymentModule = createNamespacedHelpers('payment')
const cartModule = createNamespacedHelpers('cart')
export default {
  components: {
    Paypal,
    Stripe,
    Klarna,
    Basket
  },
  data () {
    return {
      customerDetail: null,
      repairDate: null,
      isPaymentLoading: true
    }
  },
  computed: {
    ...paymentModule.mapGetters(['GET_PAYMENT_DETAILS']),
    ...cartModule.mapGetters(['GET_CART'])
  },
  mounted () {
    this.setDataToLocalStorage()
    this.getCustomerData()
    this.getRepairDate()
    this.$ga.event({
      eventCategory: 'Payment Page Reached',
      eventAction: 'action'
    })
  },
  methods: {
    ...paymentModule.mapMutations(['SET_PAID_FULL', 'SET_PAYMENT_TYPE']),
    changePayFull (val) {
      this.SET_PAID_FULL(val)
      // We need to set it to Stripe because we need PayPal to render again with new price
      this.changePaymentMethod('Stripe')
      localStorage.setItem('DD_GET_PAYMENT_DETAILS', JSON.stringify(this.GET_PAYMENT_DETAILS))
    },
    changePaymentMethod (method) {
      this.isPaymentLoading = true
      this.SET_PAYMENT_TYPE(method)
      localStorage.setItem('DD_GET_PAYMENT_DETAILS', JSON.stringify(this.GET_PAYMENT_DETAILS))
    },
    setDataToLocalStorage () {
      localStorage.setItem('DD_CART', JSON.stringify(this.GET_CART))
      localStorage.setItem('DD_GET_PAYMENT_DETAILS', JSON.stringify(this.GET_PAYMENT_DETAILS))
    },
    getCustomerData () {
      this.customerDetail = JSON.parse(localStorage.getItem('DD_CUSTOMER_DETAIL'))
    },
    getRepairDate () {
      this.repairDate = localStorage.getItem('DD_REPAIR_DATE')
    }
  }
}
</script>
