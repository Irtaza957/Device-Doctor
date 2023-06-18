<template>
  <div>
    <div v-if="!loadingModels">
      <div v-if="AllModels">
        <Container>
          <div class="relative">
            <BookingHeader header-text="Please select model" :selection="selectedModel.id !== null" @goBack="$emit('goBack')" @goNext="addToCart" />
            <div class="list-wrapper flex flex-col justify-start items-center sm:w-max w-full h-60 md:h-72 overflow-y-scroll mx-auto rounded-lg shadow-md border py-2 px-5 mt-5 mb-2">
              <div
                v-for="(model, index) in AllModels"
                :key="index"
                :class="
                  selectedModel.name === model.name
                    ? ' border-logo-red'
                    : ' border-light-gray'
                "
                class="relative border-2 rounded-md sm:w-80 w-full my-2 cursor-pointer p-3"
                @click="selectModel(model)"
              >
                <div class="flex justify-between items-start">
                  <h2 class="uppercase">
                    {{ model.name }}
                  </h2>
                </div>
              </div>
            </div>
            <div class="sm:w-max w-full mx-auto my-4">
              <div class="border border-light-gray hover:bg-gray-100 rounded-lg shadow-md sm:w-max w-full md:px-5">
                <nuxt-link to="/contact" class="block text-dark-gray4 w-full md:w-80 outline-none border-0 px-2 py-6 text-sm uppercase cursor-pointer">
                  Not shown / I don't know
                </nuxt-link>
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
            @goBack="showView='describe'"
          />
        </template>
      </div>
    </div>
    <div v-else>
      <Container>
        <BookingHeader header-text="Please select model" :selection="selectedModel.id !== null" @goBack="$emit('goBack')" @goNext="addToCart" />
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
    }
  },
  data () {
    return {
      loadingModels: false,
      AllModels: null,
      selectedModel: {
        id: null,
        name: ''
      },
      showView: 'describe',
      issueDescription: ''
    }
  },
  async created () {
    await this.getAllModels()
  },
  methods: {
    ...mobileTabletModule.mapActions(['FETCH_M_MODELS']),
    async getAllModels () {
      try {
        this.loadingModels = true
        const resp = await this.FETCH_M_MODELS(this.selectedBrand.id)
        if (resp.data.data.length) {
          this.AllModels = resp.data.data
        } else {
          this.AllModels = null
        }
        this.loadingModels = false
      } catch (error) {
        this.AllModels = null
        this.loadingModels = false
      }
    },
    selectModel (model) {
      this.selectedModel = model
    },
    addToCart () {
      this.$emit('goNext', this.selectedModel)
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
