<template>
  <div class="relative pt-0.5">
    <Container>
      <!-- Progress Bar -->
      <template v-if="showView !== 'email' && showView !== 'emptyBasket'">
        <ProgressBar :device-width="100" :device-completed="true" :basket-completed="basketCompleted" :date-completed="dateCompleted" :location-completed="locationCompleted" />
      </template>
      <!-- Empty Basket -->
      <template v-if="showView === 'emptyBasket'">
        <EmptyBasket />
      </template>
      <!-- Order Basket -->
      <template v-else-if="showView === 'email'">
        <Email @goBack="goBack" @goNext="goNextToOrderBasket" />
      </template>
      <!-- Order Basket -->
      <template v-else-if="showView === 'orderBasket'">
        <OrderBasket @goBack="goBack" @goNext="goNext" @reset="resetBasket" />
      </template>
      <!-- Date -->
      <template v-else-if="showView === 'date'">
        <DateVue @goBack="goBack" @goNext="goNextWithDate" />
      </template>
      <!-- Form -->
      <template v-else-if="showView === 'form'">
        <CustomerDetailForm @goBack="goBack" @goNext="finalNext" />
      </template>
      <!-- Checkout -->
      <template v-else-if="showView === 'checkout'">
        <Checkout @goBack="goBack" />
      </template>
    </Container>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import OrderBasket from '~/components/pages/basket/OrderBasket.vue'
import DateVue from '~/components/pages/basket/Date.vue'
import CustomerDetailForm from '~/components/pages/basket/CustomerDetailForm.vue'
import Checkout from '~/components/pages/basket/Checkout.vue'
import Email from '~/components/pages/basket/Email.vue'
import EmptyBasket from '~/components/pages/basket/EmptyBasket.vue'
import ProgressBar from '~/components/common/ProgressBar.vue'

const cartModule = createNamespacedHelpers('cart')
export default {
  components: {
    OrderBasket,
    DateVue,
    CustomerDetailForm,
    Checkout,
    Email,
    EmptyBasket,
    ProgressBar
  },
  data: () => ({
    showView: 'orderBasket'
  }),
  computed: {
    ...cartModule.mapState(['CART']),
    basketCompleted () {
      return this.showView === 'date' || this.showView === 'form' || this.showView === 'checkout'
    },
    dateCompleted () {
      return this.showView === 'form' || this.showView === 'checkout'
    },
    locationCompleted () {
      return this.showView === 'checkout'
    }
  },
  mounted () {
    this.checkItemOrEmailExists()
  },
  methods: {
    goBack () {
      switch (this.showView) {
        case 'date':
          this.showView = 'orderBasket'
          break
        case 'form':
          this.showView = 'date'
          break
        case 'checkout':
          this.showView = 'form'
          break
        default:
          break
      }
    },
    goNextToOrderBasket (formEmail) {
      this.showView = 'orderBasket'
    },
    goNextWithDate (date) {
      localStorage.setItem('DD_REPAIR_DATE', date.repairDate)
      this.showView = 'form'
    },
    goNext () {
      switch (this.showView) {
        case 'orderBasket':
          this.showView = 'date'
          break
        default:
          break
      }
    },
    finalNext (form) {
      this.showView = 'checkout'
    },
    checkItemOrEmailExists () {
      if (this.CART.totalDevices < 1) {
        this.showView = 'emptyBasket'
      } else {
        const email = this.$cookies.get('DD_EMAIL')
        if (!email) {
          this.showView = 'email'
        }
      }
    },
    resetBasket () {
      this.showView = 'emptyBasket'
    }
  }
}
</script>
