<template>
  <div>
    <!-- Mobile, Tablet & Console -->
    <div v-if="CART.mobileTablet.length" class="mb-5">
      <div v-for="(item, index) in CART.mobileTablet" :key="index" class="mb-2">
        <div class="flex flex-col justify-between border border-light-gray px-4 py-6 shadow">
          <div class="flex gap-2 md:gap-5">
            <div class="w-20">
              <img v-if="item.color" :src="item.color.image" :alt="item.color.name">
              <img v-else :src="item.brand.image">
            </div>
            <div class="flex-1">
              <div class="w-full flex flex-col md:flex-row justify-between md:mb-4">
                <div class="order-2 md:order-1">
                  <p class="text-sm font-semibold text-dark-blue uppercase">
                    {{ item.model.name }} <span v-if="item.color">{{ item.color.name }}</span>
                  </p>
                </div>
                <div v-if="showButtons" class="order-1 mb-4 md:mb-0 md:order-2">
                  <button class="text-sm font-light rounded-2xl hover:bg-gray-700 border border-gray-700 text-gray-700 hover:text-white transition-all ease-linear duration-200 py-px px-4" @click="editMobileItem(item, index)">
                    Edit
                  </button>
                  <button class="text-sm font-light rounded-2xl hover:bg-red-600 border border-logo-red hover:border-red-600 text-logo-red hover:text-white transition-all ease-linear duration-200 py-px px-4" @click="removeProduct(item)">
                    Remove
                  </button>
                </div>
              </div>
              <div v-for="(issue, idx) in item.issues" :key="idx" class="w-full flex justify-between mt-2">
                <div class="flex gap-2">
                  <p class="text-sm">
                    {{ issue.name }}
                  </p>
                  <div v-if="issue.popup_information" class="pop-up-parent relative group hover:border-logo-red h-5 w-5 border-2 rounded-full flex justify-center items-center">
                    <font-awesome-icon :icon="['fas', 'info' ]" class="text-xs text-gray-400 group-hover:text-logo-red " />
                    <div class="pop-up-child absolute bottom-full -left-2 pb-3">
                      <div class="relative bg-white border shadow text-xs font-light px-3 py-4 ">
                        {{ issue.popup_information }}
                        <div class="absolute bottom-0 right-3 transform translate-y-1/2 rotate-45 bg-white border-r-2 border-b-2 h-3 w-3 -mb-px" />
                      </div>
                    </div>
                  </div>
                </div>
                <p class="text-sm font-medium">
                  <span>&#163;{{ issue.price }}</span>
                </p>
              </div>
              <div v-if="item.issues.length > 1 && MULTI_ITEM_DISCOUNT" class="text-sm">
                <hr class="my-2">
                <div class="flex justify-between">
                  <div>
                    <p>Total (with multi item discount)</p>
                  </div>
                  <div>
                    <span>&#163;{{ totalMultiItem(item) - totalMultiItemDiscount(item) }}</span>
                    <span class="text-logo-red line-through">&#163;{{ totalMultiItem(item) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Technical Support -->
    <div v-if="CART.technicalSupport.length" class="mb-5">
      <div v-for="(item, index) in CART.technicalSupport" :key="index" class="mb-2">
        <div class="flex flex-col justify-between border border-light-gray px-4 py-6 shadow">
          <div class="flex gap-2 md:gap-5">
            <div class="w-20">
              <img :src="require('@/assets/img/booking/technical-support.svg')">
            </div>
            <div class="flex-1">
              <div class="w-full flex flex-col md:flex-row justify-between md:mb-4">
                <div class="order-2 md:order-1">
                  <p class="text-sm font-semibold text-dark-blue uppercase">
                    Technical Support
                  </p>
                </div>
                <div v-if="showButtons" class="order-1 mb-4 md:mb-0 md:order-2">
                  <button class="text-sm font-light rounded-2xl hover:bg-gray-700 border border-gray-700 text-gray-700 hover:text-white transition-all ease-linear duration-200 py-px px-4" @click="editTS(item, index)">
                    Edit
                  </button>
                  <button class="text-sm font-light rounded-2xl hover:bg-red-600 border border-logo-red hover:border-red-600 text-logo-red hover:text-white transition-all ease-linear duration-200 py-px px-4 " @click="removeTechnicalSupport(item)">
                    Remove
                  </button>
                </div>
              </div>
              <div v-if="item.issues.length">
                <div v-for="(issue, idx) in item.issues" :key="idx" class="w-full flex flex-col justify-between mt-1">
                  <p class="text-sm">
                    {{ issue.name }}
                  </p>
                  <p class="text-xs break-all">
                    <span>{{ item.selectedIssuesDescription.description }}</span>
                  </p>
                </div>
              </div>
              <div v-else>
                <div class="w-full flex justify-between mt-1">
                  <p class="text-sm">
                    {{ item.issueDescription }}
                  </p>
                </div>
              </div>
              <hr class="my-2">
              <div class="w-full flex justify-between mt-1">
                <p class="text-sm font-medium">
                  Session
                </p>
                <p class="text-sm font-medium">
                  <span>&#163;{{ item.session.price }} for {{ item.session.time }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Business Support -->
    <div v-if="CART.businessSupport.length" class="mb-5">
      <div v-for="(item, index) in CART.businessSupport" :key="index" class="mb-2">
        <div class="flex flex-col justify-between border border-light-gray px-4 py-6 shadow">
          <div class="flex gap-2 md:gap-5">
            <div class="w-20">
              <img :src="require('@/assets/img/booking/business-it-support.svg')">
            </div>
            <div class="flex-1">
              <div class="w-full flex flex-col md:flex-row justify-between md:mb-4">
                <div class="order-2 md:order-1">
                  <p class="text-sm font-semibold text-dark-blue uppercase">
                    Business Support
                  </p>
                </div>
                <div v-if="showButtons" class="order-1 mb-4 md:mb-0 md:order-2">
                  <button class="text-sm font-light rounded-2xl hover:bg-gray-700 border border-gray-700 text-gray-700 hover:text-white transition-all ease-linear duration-200 py-px px-4" @click="editBS(item, index)">
                    Edit
                  </button>
                  <button class="text-sm font-light rounded-2xl hover:bg-red-600 border border-logo-red hover:border-red-600 text-logo-red hover:text-white transition-all ease-linear duration-200 py-px px-4 " @click="removeBusinessSupport(item)">
                    Remove
                  </button>
                </div>
              </div>
              <div v-if="item.issues.length">
                <div v-for="(issue, idx) in item.issues" :key="idx" class="w-full flex justify-between mt-1">
                  <p class="text-sm">
                    {{ issue.name }}
                  </p>
                  <p class="text-sm font-medium">
                    <span>~&nbsp;{{ issue.average_time }}</span>
                  </p>
                </div>
              </div>
              <div v-else>
                <div class="w-full flex justify-between mt-1">
                  <p class="text-sm">
                    {{ item.issueDescription }}
                  </p>
                </div>
              </div>
              <hr class="my-2">
              <div class="w-full flex justify-between mt-1">
                <p class="text-sm font-medium">
                  Session
                </p>
                <p class="text-sm font-medium">
                  <span>&#163;{{ item.session.price }} for {{ item.session.time }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const cartModule = createNamespacedHelpers('cart')
export default {
  props: {
    showButtons: {
      type: Boolean,
      default: () => false
    }
  },
  data () {
    return {
      showError: false,
      discounts: []
    }
  },
  computed: {
    ...cartModule.mapState(['CART', 'MULTI_ITEM_DISCOUNT'])
  },
  methods: {
    ...cartModule.mapActions(['UPDATE_CART', 'FETCH_MULTI_ITEM_DISCOUNT']),
    ...cartModule.mapMutations(['SET_EDIT_MODE']),
    // Mobile, Tablet & Console
    async removeProduct (item) {
      const mainData = {
        type: 'delete_mobile',
        data: item
      }
      await this.UPDATE_CART(mainData)
      if (this.CART.totalDevices < 1) {
        this.$emit('reset')
      }
      this.$emit('getNextDiscount')
    },
    editMobileItem (item, index) {
      this.SET_EDIT_MODE({ mode: true, route: 'mobile-and-tablets', index })
      this.$router.push('/mobile-and-tablets')
    },
    // Technical Support
    async removeTechnicalSupport (item) {
      const mainData = {
        type: 'delete_ts',
        data: item
      }
      await this.UPDATE_CART(mainData)
      if (this.CART.totalDevices < 1) {
        this.$emit('reset')
      }
      this.$emit('getNextDiscount')
    },
    editTS (item, index) {
      this.SET_EDIT_MODE({ mode: true, route: 'mobile-and-tablets', index })
      this.$router.push('/technical-support')
    },
    // Business Support
    async removeBusinessSupport (item) {
      const mainData = {
        type: 'delete_bs',
        data: item
      }
      await this.UPDATE_CART(mainData)
      if (this.CART.totalDevices < 1) {
        this.$emit('reset')
      }
      this.$emit('getNextDiscount')
    },
    editBS (item, index) {
      this.SET_EDIT_MODE({ mode: true, route: 'mobile-and-tablets', index })
      this.$router.push('/business-support')
    },
    // Calculate tota multi item price
    totalMultiItemDiscount (item) {
      let total = 0
      item.issues.forEach((element, index) => {
        total += element.price - element.discountedPrice
      })
      return total
    },
    totalMultiItem (item) {
      let total = 0
      item.issues.forEach((element, index) => {
        total += element.price
      })
      return total
    }
  }
}
</script>

<style lang="scss" scoped>
.pop-up-parent {
  .pop-up-child {
    display: none;
    width: 19rem;
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
</style>
