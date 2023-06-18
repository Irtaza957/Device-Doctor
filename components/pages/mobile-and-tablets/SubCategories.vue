<template>
  <div>
    <div v-if="!loadingCategories">
      <div v-if="AllCategories">
        <Container>
          <BookingHeader header-text="Please select device type" :selection="selectedCategory.id !== null" @goBack="$emit('goBack')" @goNext="addToCart" />
          <div class="grid grid-cols-2 lg:grid-cols-3 gap-x-4 md:gap-x-16 xl:gap-x-24 gap-y-8 py-8 xl:px-16">
            <div
              v-for="(category, index) in AllCategories"
              :key="index"
              :class="selectedCategory.name === category.name ? 'shadow-selected-card border-logo-red' : 'shadow-none border-light-gray'"
              class="relative cursor-pointer border-2 hover:border-logo-red transition ease-linear duration-150 rounded-lg"
              @click="selectCategory(category)"
            >
              <div class="flex justify-center items-center p-3">
                <img :src="category.image" class="w-16 h-16 md:w-36 md:h-36">
              </div>
              <div class="text-sm md:text-lg text-center p-1 pb-7 capitalize">
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
      </div>
      <div v-else>
        <template v-if="showView === 'describe'">
          <DescribeIssue @goBack="$emit('goBack')" @goNextToForm="goNextToForm" />
        </template>
        <template v-else>
          <NoResultHubspotForm :flow-name="'Mobile, Tablet & Console'" :issue-description="issueDescription" @goBack="showView='describe'" />
        </template>
      </div>
    </div>
    <div v-else>
      <Container>
        <BookingHeader header-text="Please select device type" :selection="selectedCategory.id !== null" @goBack="$emit('goBack')" @goNext="addToCart" />
        <div class="grid grid-cols-2 lg:grid-cols-3 gap-x-4 md:gap-x-16 xl:gap-x-24 gap-y-8 py-8 xl:px-16">
          <div
            v-for="i in 9"
            :key="i"
          >
            <ImageBoxSkeleton />
          </div>
        </div>
      </Container>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const mobileTabletModule = createNamespacedHelpers('mobileTablet')

export default {
  data () {
    return {
      loadingCategories: false,
      AllCategories: null,
      selectedCategory: {
        id: null,
        name: ''
      },
      showView: 'describe',
      issueDescription: ''
    }
  },
  async created () {
    await this.getMobileSubCategory()
  },
  methods: {
    ...mobileTabletModule.mapActions(['FETCH_M_CATEGORY']),

    async getMobileSubCategory () {
      try {
        this.loadingCategories = true
        const resp = await this.FETCH_M_CATEGORY()
        if (resp.data.data.length) {
          this.AllCategories = resp.data.data
        } else {
          this.AllCategories = null
        }
        this.loadingCategories = false
      } catch (error) {
        this.AllCategories = null
        this.loadingCategories = false
      }
    },
    selectCategory (category) {
      this.selectedCategory = category
    },
    addToCart () {
      this.$emit('goNext', this.selectedCategory)
    },
    goNextToForm (form) {
      this.issueDescription = form.description
      this.showView = 'hubspotForm'
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
