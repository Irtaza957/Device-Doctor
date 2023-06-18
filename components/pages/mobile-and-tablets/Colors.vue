<template>
  <div>
    <div v-if="!loadingColors">
      <div v-if="AllColors">
        <Container>
          <BookingHeader header-text="Please select colors" :selection="selectedColor.id !== null" @goBack="$emit('goBack')" @goNext="addToCart" />
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-8 py-8 xl:px-16">
            <div
              v-for="(color, index) in AllColors"
              :key="index"
              :class="selectedColor.name === color.name ? 'shadow-selected-card border-logo-red' : 'shadow-none border-light-gray'"
              class="relative cursor-pointer border-2 hover:border-logo-red transition ease-linear duration-150 rounded-lg"
              @click="selectColor(color)"
            >
              <div class="flex justify-center items-center p-3">
                <img :src="color.image" class="w-16 h-16 md:w-36 md:h-36">
              </div>
              <div class="text-sm md:text-lg text-center p-1 pb-7 capitalize">
                {{ color.name }}
              </div>
              <div
                v-if="selectedColor.name === color.name"
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
          <NoResultHubspotForm
            :flow-name="'Mobile, Tablet & Console'"
            :issue-description="issueDescription"
            :selected-category="selectedCategory"
            :selected-brand="selectedBrand"
            :selected-model="selectedModel"
            @goBack="showView='describe'"
          />
        </template>
      </div>
    </div>
    <div v-else>
      <Container>
        <BookingHeader header-text="Please select colors" :selection="selectedColor.id !== null" @goBack="$emit('goBack')" @goNext="addToCart" />
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
    },
    selectedBrand: {
      type: Object,
      default: () => {}
    },
    selectedModel: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      loadingColors: false,
      AllColors: null,
      selectedColor: {
        id: null,
        name: ''
      },
      showView: 'describe',
      issueDescription: ''
    }
  },
  async created () {
    await this.getAllColors()
  },
  methods: {
    ...mobileTabletModule.mapActions(['FETCH_M_COLORS']),
    async getAllColors () {
      try {
        this.loadingColors = true
        const resp = await this.FETCH_M_COLORS(this.selectedModel.id)
        if (resp.data.data.length) {
          this.AllColors = resp.data.data
        } else {
          this.AllColors = null
        }
        this.loadingColors = false
      } catch (error) {
        this.AllColors = null
        this.loadingColors = false
      }
    },
    selectColor (color) {
      this.selectedColor = color
    },
    addToCart () {
      this.$emit('goNext', this.selectedColor)
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
