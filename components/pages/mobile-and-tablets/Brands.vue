<template>
  <div>
    <div v-if="!loadingBrands">
      <div v-if="AllBrands">
        <Container>
          <BookingHeader :header-text="`please select the brand of your ${selectedCategory.name}`" :selection="selectedBrand.id !== null" @goBack="$emit('goBack')" @goNext="addToCart" />
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-8 py-8 xl:px-16">
            <div
              v-for="(brand, index) in AllBrands"
              :key="index"
              :class="selectedBrand.name === brand.name ? 'shadow-selected-card border-logo-red' : 'shadow-none border-light-gray'"
              class="relative cursor-pointer border-2 hover:border-logo-red transition ease-linear duration-150 rounded-lg"
              @click="selectBrand(brand)"
            >
              <div class="flex justify-center items-center p-3">
                <img :src="brand.image" class="w-16 h-16 md:w-36 md:h-36">
              </div>
              <div class="text-sm md:text-lg text-center p-1 pb-7 capitalize">
                {{ brand.name }}
              </div>
              <div
                v-if="selectedBrand.name === brand.name"
                class="absolute h-12 w-12 flex justify-center items-center rounded-full bg-black text-white left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2"
              >
                <font-awesome-icon :icon="['fas', 'check']" class="text-lg" />
              </div>
            </div>
          </div>
          <div class="sm:w-max w-full mx-auto my-8">
            <div class="border border-light-gray hover:bg-gray-100 rounded-lg shadow-md sm:w-max w-full md:px-5">
              <nuxt-link to="/contact" class="block text-dark-gray4 w-full md:w-80 outline-none border-0 px-2 py-6 text-sm uppercase cursor-pointer">
                Not shown / I don't know
              </nuxt-link>
            </div>
          </div>
        </Container>
      </div>
      <div v-else>
        <template v-if="showView === 'describe'">
          <DescribeIssue @goBack="$emit('goBack')" @goNextToForm="goNextToForm" />
        </template>
        <template v-else>
          <NoResultHubspotForm
            :flow-name="'Mobile, Tablet & Console'"
            :issue-description="issueDescription"
            :selected-category="selectedCategory"
            @goBack="showView='describe'"
          />
        </template>
      </div>
    </div>
    <div v-else>
      <Container>
        <BookingHeader :header-text="`please select the brand of your ${selectedCategory.name}`" :selection="selectedBrand.id !== null" @goBack="$emit('goBack')" @goNext="addToCart" />
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-8 py-8 xl:px-16">
          <div
            v-for="i in 6"
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
  props: {
    selectedCategory: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      loadingBrands: false,
      AllBrands: null,
      selectedBrand: {
        id: null,
        name: ''
      },
      showView: 'describe',
      issueDescription: ''
    }
  },
  async created () {
    await this.getAllBrands()
  },
  methods: {
    ...mobileTabletModule.mapActions(['FETCH_M_BRANDS']),
    async getAllBrands () {
      try {
        this.loadingBrands = true
        const resp = await this.FETCH_M_BRANDS(this.selectedCategory.id)
        if (resp.data.data.length) {
          this.AllBrands = resp.data.data
        } else {
          this.AllBrands = null
        }
        this.loadingBrands = false
      } catch (error) {
        this.AllBrands = null
        this.loadingBrands = false
      }
    },
    selectBrand (brand) {
      this.selectedBrand = brand
    },
    addToCart () {
      this.$emit('goNext', this.selectedBrand)
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
