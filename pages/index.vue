<template>
  <div v-if="!isLoading" class="relative">
    <div v-if="categories" class="relative">
      <Container>
        <BookingHeader :selection="selectedCategory.id !== null" header-text="What can we help you with?" @nextStep="nextStep" />
        <div class="grid grid-cols-2 lg:grid-cols-3 gap-x-4 md:gap-x-16 xl:gap-x-24 gap-y-8 py-8 xl:px-16">
          <div
            v-for="(category, index) in categories"
            :key="index"
            :class="selectedCategory.name === category.name ? 'shadow-selected-card border-logo-red' : 'shadow-none border-light-gray'"
            class="relative cursor-pointer border-2 hover:border-logo-red transition ease-linear duration-150 rounded-lg px-3 pt-5 pb-0"
            @click="toggleSelect(category)"
          >
            <div class="flex justify-center items-center">
              <img :src="require(`@/assets/img/booking/${category.image}`)" class="w-16 h-16 md:w-36 md:h-36">
              <!-- <img :src="category.image" class="w-16 h-16 md:w-36 md:h-36"> -->
            </div>
            <div class="text-sm md:text-lg text-center break-all mt-3 mb-7">
              {{ category.name }}
            </div>
            <div
              v-if="selectedCategory.name === category.name"
              class="absolute h-12 w-12 flex justify-center items-center rounded-full bg-black text-white left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2"
            >
              <font-awesome-icon :icon="['fas', 'check']" class="text-lg" />
            </div>
          </div>
        </div>
      </Container>
      <CompleteOrderAlert v-if="showAlert" @close="showAlert = false" @clearOrder="clearOrder" />
    </div>
    <div v-else>
      <NoCategoryFound />
    </div>
  </div>
  <div v-else>
    <Container>
      <BookingHeader :selection="selectedCategory.id !== null" header-text="What can we help you with?" :next-step="nextStep" />
      <div class="grid grid-cols-2 lg:grid-cols-3 gap-x-4 md:gap-x-16 xl:gap-x-24 gap-y-8 py-8 xl:px-16">
        <div v-for="i in 6" :key="i">
          <ImageBoxSkeleton />
        </div>
      </div>
    </Container>
  </div>
</template>
<script>
import { mapState, createNamespacedHelpers } from 'vuex'
import BookingHeader from '~/components/pages/booking/BookingHeader.vue'
import NoCategoryFound from '~/components/pages/booking/NoCategoryFound.vue'
import CompleteOrderAlert from '~/components/common/modals/CompleteOrderAlert.vue'

const categoryModule = createNamespacedHelpers('categories')
const paymentModule = createNamespacedHelpers('payment')
const cartModule = createNamespacedHelpers('cart')
export default {
  components: {
    BookingHeader,
    NoCategoryFound,
    CompleteOrderAlert
  },
  data: () => ({
    categories: [
      { id: 1, name: 'Mobile, Tablet & Console Repairs', image: 'mobile-tablet.svg' },
      { id: 3, name: 'Call out Technical Support & Tuition.', image: 'technical-support.svg' },
      { id: 6, name: 'Business IT Support.', image: 'business-it-support.svg' },
      { id: 2, name: 'Mac, Laptop & PC Repairs.', image: 'mac-laptop-pc.svg' },
      { id: 4, name: 'Smart home installations/improvements.', image: 'smart-home-installations.svg' }
      // { id: 5, name: 'New Refurnished Devices.', image: 'sales-and-setup.svg' },
    ],
    selectedCategory: {
      id: null,
      name: ''
    },
    isLoading: false,
    // Mac Alert
    showAlert: false
  }),
  computed: {
    ...mapState(['AUTHENTICATED']),
    ...cartModule.mapState(['CART'])
  },
  created () {
    this.isLoading = true
    // await this.getCategories()
  },
  mounted () {
    this.isLoading = false
  },
  methods: {
    ...categoryModule.mapActions(['FETCH_CATEGORIES']),
    ...cartModule.mapMutations(['EMPTY_CART']),
    ...paymentModule.mapMutations(['RESET_PAYMENT_DETAILS']),
    async getCategories () {
      try {
        this.isLoading = true
        const resp = await this.FETCH_CATEGORIES()
        if (resp.data.data.length) {
          this.categories = resp.data.data
        } else {
          this.categories = null
        }
        this.isLoading = false
      } catch (error) {
        this.categories = null
        this.isLoading = false
      }
    },
    toggleSelect (obj) {
      this.selectedCategory = obj
    },
    nextStep () {
      if (this.selectedCategory.id === 1) {
        this.$router.push('/mobile-and-tablets')
      } else if (this.selectedCategory.id === 2) {
        if (this.CART.totalDevices < 1) {
          this.$router.push('/mac-laptop-and-pc')
        } else {
          this.showAlert = true
        }
      } else if (this.selectedCategory.id === 3) {
        this.$router.push('/technical-support')
      } else if (this.selectedCategory.id === 4) {
        if (this.CART.totalDevices < 1) {
          this.$router.push('/smart-home-installations')
        } else {
          this.showAlert = true
        }
      //  This category is in pending state for now
      // } else if (this.selectedCategory.id === 5) {
      //   this.$router.push('/new-refurnished-devices')
      } else if (this.selectedCategory.id === 6) {
        this.$router.push('/business-support')
      }
    },
    clearOrder () {
      localStorage.removeItem('DD_REPAIR_DATE')
      localStorage.removeItem('DD_CUSTOMER_DETAIL')
      localStorage.removeItem('DD_GET_PAYMENT_DETAILS')
      localStorage.removeItem('DD_CART')
      this.EMPTY_CART()
      this.RESET_PAYMENT_DETAILS()
      this.showAlert = false
      this.nextStep()
    }
  }
}
</script>
