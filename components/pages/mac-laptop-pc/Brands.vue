<template>
  <div>
    <div v-if="!loadingBrands">
      <div v-if="laptopBrands">
        <Container>
          <BookingHeader header-text="Please select brand" :is-header-text-uppercase="false" :selection="selectedBrand.id !== null" @goBack="$emit('goBack')" @goNext="$emit('goNext', typeCategory, selectedBrand)" />
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-8 py-8 xl:px-16">
            <div
              v-for="(brand, index) in laptopBrands"
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
        </Container>
      </div>
      <div v-else>
        <NoResultHubspotForm :flow-name="'Business Support'" @goBack="$emit('goBack')" />
      </div>
    </div>
    <div v-else>
      <Container>
        <BookingHeader header-text="Please select brand" :is-header-text-uppercase="false" :selection="selectedBrand.id !== null" @goBack="$emit('goBack')" @goNext="$emit('goNext')" />
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-8 py-8 xl:px-16">
          <div
            v-for="i in 12"
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
const laptopModule = createNamespacedHelpers('laptop')

export default {
  data () {
    return {
      loadingBrands: false,
      laptopBrands: null,
      selectedBrand: {
        id: null,
        name: ''
      },
      typeCategory: null
    }
  },
  async created () {
    await this.getLaptopBrands()
  },
  methods: {
    ...laptopModule.mapActions(['FETCH_LAPTOP_BRANDS']),
    async getLaptopBrands () {
      try {
        this.loadingBrands = true
        const resp = await this.FETCH_LAPTOP_BRANDS()
        if (resp.data.data.length) {
          this.laptopBrands = resp.data.data
        } else {
          this.laptopBrands = null
        }
        this.loadingBrands = false
      } catch (error) {
        this.laptopBrands = null
        this.loadingBrands = false
      }
    },
    selectBrand (obj) {
      this.selectedBrand = obj
      if (obj.name.toLowerCase() === 'apple') {
        this.typeCategory = 'apple'
      } else {
        this.typeCategory = 'other'
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
