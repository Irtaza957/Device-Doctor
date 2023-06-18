<template>
  <div>
    <div v-if="!loadingIssues">
      <div v-if="pendingIssues">
        <Container>
          <BookingHeader header-text="Frequently purchased with this:" :selection="true" @goBack="$emit('goBack')" @goNext="addToCart" />
          <div class="w-full sm:w-96 mx-auto pl-4">
            <p>Your current selection</p>
            <p v-for="(item, index) in selectedIssues" :key="index">
              {{ item.name }}
            </p>
          </div>
          <div class="list-wrapper flex flex-col justify-start items-center sm:w-max w-full h-72 overflow-y-scroll mx-auto rounded-lg shadow-md border py-2 px-5 my-5">
            <div
              v-for="(issue, index) in pendingIssues"
              :key="index"
              :class="
                isSelectedIssues[index]
                  ? ' border-logo-red'
                  : ' border-light-gray'
              "
              class="relative border-2 rounded-md sm:w-80 w-full my-2 cursor-pointer p-3"
              @click="selectIssues(index)"
            >
              <div class="flex flex-col">
                <div class="flex justify-between items-center">
                  <div class="flex">
                    <h2 class="uppercase text-sm">
                      {{ issue.name }}
                    </h2>
                  </div>
                  <!-- <div class="flex gap-1"> -->
                  <!-- <p class="text-sm font-semibold">
                      &#163;{{ calculatePercentPrice(issue.price) }}
                    </p> -->
                  <!-- <p v-if="issue.price < highestPriceInItems || issue.price < highestPriceInPendingItems" class="text-sm text-logo-red line-through"> -->
                  <!-- <p class="text-sm text-logo-red line-through">
                      &#163;{{ issue.price }}
                    </p> -->
                  <!-- </div> -->
                </div>
                <div v-if="issue.upsale_description" class="text-xs mt-1">
                  <p>
                    {{ issue.upsale_description }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
      <div v-else>
        <NoResultHubspotForm :flow-name="'Mobile, Tablet & Console'" @goBack="$emit('goBack')" />
      </div>
    </div>
    <div v-else>
      <Container>
        <BookingHeader header-text="Frequently purchased with this:" :selection="true" @goBack="$emit('goBack')" @goNext="addToCart" />
        <div class="list-wrapper flex flex-col justify-start items-center sm:w-max w-full h-72 overflow-y-scroll mx-auto rounded-lg shadow-md border py-2 px-5 my-5">
          <div
            v-for="i in 6"
            :key="i"
          >
            <TextBoxSkeleton />
          </div>
        </div>
      </Container>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const cartModule = createNamespacedHelpers('cart')
export default {
  props: {
    pendingIssues: {
      type: Array,
      default: () => []
    },
    selectedIssues: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      loadingIssues: false,
      isSelectedIssues: [],
      isOneIssueSelected: false,
      issueDescription: ''
      // Multi item discount
      // multiItemDiscount: null
      // highestPriceInItems: 0,
      // highestPriceInPendingItems: 0
    }
  },
  created () {
    this.loadingIssues = true
    // await this.fetchMultiItemDiscount()
    if (this.pendingIssues.length) {
      this.pendingIssues.forEach((element, index) => {
        this.isSelectedIssues[index] = false
        // if (element.price > this.highestPriceInPendingItems) {
        //   this.highestPriceInPendingItems = element.price
        // }
      })
    }
    // Set highest Price
    // this.selectedIssues.forEach((element, index) => {
    //   if (element.price > this.highestPriceInItems) {
    //     this.highestPriceInItems = element.price
    //   }
    // })
  },
  mounted () {
    this.loadingIssues = false
  },
  methods: {
    ...cartModule.mapActions(['FETCH_MULTI_ITEM_DISCOUNT']),
    // async fetchMultiItemDiscount () {
    //   try {
    //     const resp = await this.FETCH_MULTI_ITEM_DISCOUNT()
    //     if (resp) {
    //       this.multiItemDiscount = resp.data.data
    //     } else {
    //       this.multiItemDiscount = null
    //     }
    //   } catch (error) {
    //     this.loadingIssues = false
    //   }
    // },
    selectIssues (index) {
      this.$set(this.isSelectedIssues, index, !this.isSelectedIssues[index])
      // For enable Next btn
      this.isOneIssueSelected = false
      this.isSelectedIssues.forEach((element) => {
        if (element) {
          this.isOneIssueSelected = true
        }
      })
    },
    addToCart () {
      const selectedIssues = []
      this.isSelectedIssues.forEach((element, index) => {
        if (element) {
          const upsaleIssue = this.pendingIssues[index]
          selectedIssues.push(upsaleIssue)
        }
      })
      this.$emit('goNext', selectedIssues)
    }
    // calculatePercentPrice (price) {
    //   if (this.multiItemDiscount) {
    //     if (price > this.highestPriceInItems && price >= this.highestPriceInPendingItems) {
    //       // return price
    //       return Math.ceil(price - (this.multiItemDiscount.discount / 100) * this.highestPriceInItems)
    //     }
    //     return Math.ceil(price - (this.multiItemDiscount.discount / 100) * price)
    //   } else {
    //     return price
    //   }
    // }
  }
}
</script>
