<template>
  <div>
    <div>
      <div class="sticky top-0">
        <Header :show-back-button="false" :selection="canGoNext" @goBack="$emit('goBack')" @goNext="$emit('goNext')" />
      </div>
      <div class="text-2xl text-center font-semibold text-dark-gray mt-5 md:mt-0">
        Your Basket
      </div>
      <div v-if="CART" class="w-full mx-auto mt-5">
        <!-- Notification -->
        <transition name="slide-fade">
          <div v-if="showPromoAlert" class="lg:mx-28 mb-8">
            <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
              <span class="block sm:inline">Your discount has been applied: </span>
              <strong class="font-bold">{{ CART.promocode.code }}</strong>
              <span class="absolute top-0 bottom-0 right-0 px-4 py-3" @click="showPromoAlert = false">
                <svg class="fill-current h-6 w-6 text-green-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" /></svg>
              </span>
            </div>
          </div>
        </transition>
        <div class="flex xl:flex-row flex-col mb-8 lg:px-28">
          <div class="flex-1 xl:pr-5">
            <Basket :show-buttons="true" @getNextDiscount="getNextDiscount" @reset="resetBasket" />
            <nuxt-link to="/">
              <div class="border border-light-gray p-5 mb-8 text-center shadow uppercase">
                Add another service for £{{ nextDiscount }} off
              </div>
            </nuxt-link>
            <div class="grid grid-cols-3 gap-2 md:gap-10 my-5">
              <img src="@/assets/img/TopQuality.jpg" alt="top quality parts">
              <img src="@/assets/img/12Month.jpg" alt="12 months warranty">
              <img src="@/assets/img/ppklarna.jpg" alt="paypal and klarna">
            </div>
          </div>
          <div class="xl:w-72 w-full p-5 bg-gray-50 text-sm">
            <div v-if="CART.totalDevices > 1" class="flex justify-between mt-5">
              <div>
                Multi Device Discount ({{ CART.totalDevices }}X)
              </div>
              <div>
                &#163;{{ CART.multiDeviceDiscount }}
              </div>
            </div>
            <div v-else class="pop-up-parent relative">
              <p class="underline cursor-pointer">
                Add another device to get our multi device discount
              </p>
              <div class="pop-up-child absolute top-full left-0 pb-3">
                <div class="relative bg-white border shadow text-xs font-light px-3 py-4 ">
                  <div v-for="(discount, index) in discounts" :key="index">
                    <div class="flex justify-between mb-1">
                      <p>
                        {{ discount.no_of_devices }} X
                      </p>
                      <p>
                        &#163;{{ discount.discount }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="CART.promocode" class="flex justify-between gap-5 mt-5">
              <div class="text-dark-blue">
                <span class="font-semibold">{{ CART.promocode.code }}</span> - {{ CART.promocode.description }}
              </div>
              <div v-if="CART.promocode.type === 'fixed'">
                &#163;{{ CART.promocode.discount }}
              </div>
              <div v-else>
                {{ CART.promocode.discount }}%
              </div>
            </div>
            <div class="flex justify-between gap-5 mt-5">
              <div>
                Basket Subtotal
              </div>
              <div>
                &#163;{{ CART.totalPrice }}
              </div>
            </div>
            <div class="flex justify-between gap-5 mt-2">
              <div>
                Total Savings
              </div>
              <div>
                &#163;{{ CART.totalPrice - CART.subTotal }}
              </div>
            </div>
            <hr class="mt-2 mb-4">
            <div class="flex justify-between gap-5 mb-5">
              <div>
                Total
              </div>
              <div class="font-semibold text-dark-blue">
                &#163;{{ CART.subTotal }} (inc VAT)
              </div>
            </div>
            <ValidationObserver v-slot="{ handleSubmit }" ref="promoValidate">
              <form @submit.prevent="handleSubmit(onSubmit)">
                <div class="flex flex-col">
                  <ValidationProvider
                    v-slot="{ errors }"
                    name="code"
                    rules="required"
                  >
                    <input
                      v-model="code"
                      type="text"
                      autocomplete="on"
                      placeholder="Enter discount code"
                      :class="errors[0] ? 'border-logo-red text-logo-red placeholder-logo-red focus:border-logo-red' : 'border-light-gray focus:border-light-blue text-dark-gray'"
                      class="w-full py-2 px-4 border text-sm outline-none"
                    >
                    <span v-if="showError" class="text-logo-red text-xs">{{ errorMessage }}</span>
                  </ValidationProvider>
                  <div class="mt-2">
                    <button type="submit" class="w-full uppercase bg-purple-400 text-white px-4 py-2 text-sm">
                      Apply Code
                    </button>
                  </div>
                </div>
              </form>
            </ValidationObserver>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import Header from '@/components/pages/basket/Header.vue'
import Basket from '@/components/pages/basket/common/Basket.vue'
const cartModule = createNamespacedHelpers('cart')
export default {
  components: {
    Header,
    Basket
  },
  data () {
    return {
      code: null,
      showError: false,
      errorMessage: '',
      discounts: [],
      nextDiscount: 0,
      showPromoAlert: false
    }
  },
  computed: {
    ...cartModule.mapState(['CART', 'PROMO_NEGATIVE']),
    canGoNext () {
      return this.CART.mobileTablet.length > 0 ||
      this.CART.technicalSupport.length > 0 ||
      this.CART.businessSupport.length > 0
    }
  },
  async mounted () {
    if (this.CART.promocode) {
      this.code = this.CART.promocode.code
    }
    const resp = await this.FETCH_MULTI_DEVICE_DISCOUNT()
    if (resp) {
      this.discounts = resp.data.data
      this.getNextDiscount()
    }
  },
  methods: {
    ...cartModule.mapMutations(['SET_PROMO_NEGATIVE']),
    ...cartModule.mapActions(['FETCH_MULTI_DEVICE_DISCOUNT', 'APPLY_PROMOCODE']),
    getNextDiscount () {
      let highestDeviceNumber = 0
      let highestDeviceDiscount = 0
      this.nextDiscount = 0
      this.discounts.forEach((element) => {
        if ((this.CART.totalDevices + 1) === element.no_of_devices) {
          this.nextDiscount = element.discount
        }
        if (element.no_of_devices > highestDeviceNumber) {
          highestDeviceNumber = element.no_of_devices
          highestDeviceDiscount = element.discount
        }

        if ((this.CART.totalDevices + 1) > highestDeviceNumber) {
          this.nextDiscount = highestDeviceDiscount
        }
      })
    },
    // Apply promocode
    onSubmit () {
      this.$refs.promoValidate.validate().then(async (success) => {
        if (success) {
          const resp = await this.APPLY_PROMOCODE(this.code)
          if (!resp) {
            this.errorMessage = 'The promocode is not valid'
            this.showError = true
          } else if (this.PROMO_NEGATIVE) {
            this.errorMessage = 'This promocode cannot be applied as your price is less than the discount'
            this.showError = true
            this.SET_PROMO_NEGATIVE(false)
          } else {
            this.showPromoAlert = true
            this.showError = false
          }
        }
      })
    },
    resetBasket () {
      this.code = null
      this.$refs.promoValidate.reset()
      this.$emit('reset')
    }
  }
}
</script>

<style lang="scss" scoped>
.pop-up-parent {
  .pop-up-child {
    display: none;
    width: 100%;
  }
  &:hover .pop-up-child {
    display: block;
    animation: popup .2s ease-in-out;
  }
}

@keyframes popup {
  0%{
    opacity: 0;
    transform: scale(.8) ;
  }
  80%{
    opacity: 1;
    transform: scale(1.03) ;
  }
  100%{
    opacity: 1;
    transform: scale(1) ;
  }
}
// Slide Animation
/* Enter and leave animations can use different */
/* durations and timing functions.              */
.slide-fade-enter-active {
  transition: all .5s ease;
}
.slide-fade-leave-active {
  transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(100px);
  opacity: 0;
}
</style>
