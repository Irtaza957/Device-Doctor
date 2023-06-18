<template>
  <div>
    <div v-if="!loadingIssues">
      <div v-if="AllIssues">
        <Container>
          <BookingHeader header-text="Select or describe your device issue" :selection="canGoNext" @goBack="$emit('goBack')" @goNext="addToCart" />
          <div class="sm:w-96 w-full mx-auto mt-2 md:mt-5">
            <p class="text-center">
              Select multiple if needed
            </p>
          </div>
          <div class="list-wrapper flex flex-col justify-start items-center sm:w-max w-full h-60 md:h-72 overflow-y-scroll mx-auto rounded-lg shadow-md border py-2 px-5 mb-5">
            <div
              v-for="(issue, index) in AllIssues"
              :key="index"
              :class="
                isSelectedIssues[index]
                  ? ' border-logo-red'
                  : ' border-light-gray'
              "
              class="relative border-2 rounded-md sm:w-80 w-full my-2 cursor-pointer p-3"
              data-modal-toggle="defaultModal"
              @click="selectIssues(index, issue)"
            >
              <div class="flex justify-between items-center gap-2">
                <div class="flex-1">
                  <h2 class="uppercase">
                    {{ issue.name }}
                  </h2>
                </div>
                <div v-if="issue.popup_information" class="relative hover:border-logo-red  h-7 w-7 border-2 rounded-full flex justify-center items-center" @click.stop="showDescriptionModal(issue.popup_information)">
                  <font-awesome-icon :icon="['fas', 'info' ]" class="text-xs text-gray-400 group-hover:text-logo-red " />
                </div>
              </div>
            </div>
          </div>
          <template v-if="showDescriptionPopup">
            <DescriptionPopup :popup-information="issuePopupInformation" @closeModal="showDescriptionPopup = false" />
          </template>
          <div class="sm:w-max w-full mx-auto my-4">
            <div class="sm:w-96 w-full">
              <h2 class="text-xl md:text-2xl text-center font-semibold text-dark-gray mt-5 mb-2">
                Or describe your issue here
              </h2>
              <textarea
                v-model="issueDescription"
                rows="3"
                placeholder="Please describe here"
                class="border-light-gray focus:border-light-blue text-dark-gray w-full border outline-none p-3 rounded-lg shadow-md"
              />
            </div>
          </div>
        </Container>
      </div>
      <div v-else>
        <!-- <NoResultHubspotForm :flow-name="'Mobile, Tablet & Console'" @goBack="$emit('goBack')" /> -->
        <template v-if="showView === 'describe'">
          <DescribeIssue @goBack="$emit('goBack')" @goNextToForm="goNextToForm" />
        </template>
        <template v-else>
          <NoResultHubspotForm
            :flow-name="'Mobile, Tablet & Console'"
            :issue-description="issueDescriptionHubspot"
            :selected-category="selectedCategory"
            :selected-brand="selectedBrand"
            :selected-model="selectedModel"
            :selected-color="selectedColor"
            @goBack="showView='describe'"
          />
        </template>
      </div>
    </div>
    <div v-else>
      <Container>
        <BookingHeader header-text="Select or describe your device issue" :selection="isOneIssueSelected" @goBack="$emit('goBack')" @goNext="addToCart" />
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
import DescriptionPopup from './DescriptionPopup.vue'
const mobileTabletModule = createNamespacedHelpers('mobileTablet')
const cartModule = createNamespacedHelpers('cart')
export default {
  components: {
    DescriptionPopup
  },
  props: {
    selectedCategory: {
      type: Object,
      default: () => {}
    },
    selectedBrand: {
      type: Object,
      default: () => {}
    },
    selectedModel: {
      type: Object,
      default: () => {}
    },
    selectedColor: {
      type: Object,
      default: () => {}
    },
    isEdit: {
      type: Boolean,
      default: () => false
    }
  },
  data () {
    return {
      loadingIssues: false,
      AllIssues: null,
      onlyUpsaleIssues: [],
      isSelectedIssues: [],
      isOneIssueSelected: false,
      issueDescription: '',
      showDescriptionPopup: false,
      issuePopupInformation: '',
      showView: 'describe',
      issueDescriptionHubspot: ''
    }
  },
  computed: {
    ...cartModule.mapState(['EDIT_MODE', 'CART']),
    canGoNext () {
      return this.isOneIssueSelected || this.issueDescription.length > 0
    }
  },
  watch: {
    issueDescription (val) {
      if (val.length > 0) {
        this.isSelectedIssues = this.AllIssues.map(() => {
          return false
        })
        this.isOneIssueSelected = false
      }
    }
  },
  async created () {
    await this.getAllIssues()
  },
  methods: {
    ...mobileTabletModule.mapActions(['FETCH_ISSUES_BY_MODEL_AND_COLOR']),
    async getAllIssues () {
      try {
        this.loadingIssues = true
        const data = {
          model_id: this.selectedModel.id,
          color_id: this.selectedColor.id
        }
        const resp = await this.FETCH_ISSUES_BY_MODEL_AND_COLOR(data)
        if (resp.data.data.length) {
          this.AllIssues = resp.data.data
          this.onlyUpsaleIssues = this.AllIssues.filter((item) => {
            return item.only_upsale === 1
          })
          this.AllIssues = this.AllIssues.filter((item) => {
            return item.only_upsale === 0
          })
          this.isSelectedIssues = this.AllIssues.map(() => {
            return false
          })
          // If the quantity if greater or equal to 1 than that item must be shown
          // this.AllIssues = this.AllIssues.filter((item) => {
          //   return item.quantity >= 1
          // })
          // Set remaining quantity to check quantity level on frontend
          // this.AllIssues.forEach((element, index) => {
          //   this.AllIssues[index].remaining_quantity = this.AllIssues[index].quantity
          // })
        } else {
          this.AllIssues = null
        }
        // this.filterModelIssues()
        this.loadingIssues = false
      } catch (error) {
        this.AllIssues = null
        this.loadingIssues = false
      }
    },
    // filterModelIssues () {
    //   let currentModelIssues = []
    //   if (this.EDIT_MODE.mode) {
    //     const currentModelIssuesWithoutExcluding = this.CART.mobileTablet.filter((_, i) => ![this.EDIT_MODE.index].includes(i))
    //     currentModelIssues = currentModelIssuesWithoutExcluding.filter((item) => {
    //       return (item.model.mobile_category_id === this.selectedCategory.id) &&
    //     (item.model.mobile_brand_id === this.selectedBrand.id) &&
    //     (item.model.id === this.selectedModel.id)
    //     })
    //   } else {
    //     currentModelIssues = this.CART.mobileTablet.filter((item) => {
    //       return (item.model.mobile_category_id === this.selectedCategory.id) &&
    //       (item.model.mobile_brand_id === this.selectedBrand.id) &&
    //       (item.model.id === this.selectedModel.id)
    //     })
    //   }

    //   currentModelIssues.forEach((element) => {
    //     element.issues.forEach((issue) => {
    //       const index = this.AllIssues.map((e) => { return e.id }).indexOf(issue.id)
    //       this.AllIssues[index].remaining_quantity = this.AllIssues[index].remaining_quantity - 1
    //     })
    //   })

    //   this.AllIssues = this.AllIssues.filter((issue) => {
    //     return issue.remaining_quantity > 0
    //   })
    //   this.AllIssues.forEach((element, index) => {
    //     this.isSelectedIssues[index] = false
    //   })
    // },
    selectIssues (index, issue) {
      this.$set(this.isSelectedIssues, index, !this.isSelectedIssues[index])
      // For enable Next btn
      this.isOneIssueSelected = false
      this.isSelectedIssues.forEach((element) => {
        if (element) {
          this.issueDescription = ''
          this.isOneIssueSelected = true
        }
      })
      if (issue.popup_information && this.isSelectedIssues[index]) {
        this.showDescriptionPopup = true
        this.issuePopupInformation = issue.popup_information
      }
    },
    addToCart () {
      const selectedIssues = []
      let pendingIssues = []
      this.isSelectedIssues.forEach((element, index) => {
        if (element) {
          selectedIssues.push(this.AllIssues[index])
        } else {
          pendingIssues.push(this.AllIssues[index])
        }
      })
      pendingIssues = pendingIssues.concat(this.onlyUpsaleIssues)
      this.$emit('goNext', selectedIssues, pendingIssues, this.issueDescription)
    },
    showDescriptionModal (desc) {
      this.issuePopupInformation = desc
      this.showDescriptionPopup = true
    },
    goNextToForm (form) {
      this.issueDescriptionHubspot = form.description
      this.showView = 'hubspotForm'
    }
  }
}
</script>
