<template>
  <div>
    <div v-if="!loadingServices">
      <div v-if="services">
        <BookingHeader header-text="Select service?" :is-header-text-uppercase="false" :selection="canGoNext" @goBack="$emit('goBack')" @goNext="goNext" />
        <div class="sm:w-max w-full mx-auto my-4">
          <div class="border-2 border-light-gray hover:bg-gray-100 sm:w-max w-full md:px-5">
            <button class="text-dark-gray4 w-full md:w-80 outline-none border-0 px-2 py-4 text-sm uppercase cursor-pointer" @click="$emit('goToIssues')">
              Book one of our technician now
            </button>
          </div>
        </div>
        <div class="list-wrapper flex flex-col justify-start items-center sm:w-max w-full h-72 overflow-y-scroll mx-auto rounded-lg shadow-md border py-2 px-5 my-5">
          <div
            v-for="(service, index) in services"
            :key="index"
            :class="
              selectedServicesBoolean[index]
                ? ' border-logo-red'
                : ' border-light-gray'
            "
            class="relative border-2 rounded-md sm:w-80 w-full my-2 cursor-pointer p-3"
            @click="selectService(index)"
          >
            <div class="flex justify-between items-start">
              <h2 class="Capitalize font-semibold">
                {{ service.name }}
              </h2>
            </div>
            <p class="font-light text-xs">
              {{ service.description }}
            </p>
          </div>
        </div>
        <div class="sm:w-max w-full mx-auto my-4">
          <div class="sm:w-96 w-full">
            <label>Or Something else</label>
            <textarea
              v-model="serviceDescription"
              rows="3"
              placeholder="Please describe here"
              class="border-light-gray focus:border-light-blue text-dark-gray w-full border outline-none p-3 rounded-lg shadow-md"
            />
          </div>
        </div>
      </div>
      <div v-else>
        <NoResultHubspotForm :flow-name="'Business Support'" @goBack="$emit('goBack')" />
      </div>
    </div>
    <div v-else>
      <BookingHeader header-text="Select service?" :is-header-text-uppercase="false" :selection="true" @goBack="$emit('goBack')" @goNext="goNext" />
      <div class="list-wrapper flex flex-col justify-start items-center sm:w-max w-full h-72 overflow-y-scroll mx-auto rounded-lg shadow-md border py-2 px-5 my-5">
        <div
          v-for="i in 6"
          :key="i"
        >
          <TextBoxSkeleton />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const businessITSupportModule = createNamespacedHelpers('businessITSupport')
export default {
  data () {
    return {
      loadingServices: false,
      services: [],
      selectedServicesBoolean: [],
      isOneServiceSelected: false,
      serviceDescription: ''
    }
  },
  computed: {
    canGoNext () {
      return this.isOneServiceSelected || this.serviceDescription.length > 0
    }
  },
  watch: {
    serviceDescription (val) {
      if (val.length > 0) {
        this.selectedServicesBoolean = this.services.map(() => {
          return false
        })
        this.isOneServiceSelected = false
      }
    }
  },
  async created () {
    await this.fetchServices()
  },
  methods: {
    ...businessITSupportModule.mapActions(['FETCH_BS_SERVICES']),

    async fetchServices () {
      try {
        this.loadingServices = true
        const resp = await this.FETCH_BS_SERVICES()
        if (resp.data.data.length) {
          this.services = resp.data.data
        } else {
          this.services = null
        }
        this.selectedServicesBoolean = this.services.map(() => {
          return false
        })
        this.loadingServices = false
      } catch (error) {
        this.services = null
        this.loadingServices = false
      }
    },
    selectService (index) {
      this.$set(this.selectedServicesBoolean, index, !this.selectedServicesBoolean[index])
      // For enable Next btn
      this.isOneServiceSelected = false
      this.selectedServicesBoolean.forEach((element) => {
        if (element) {
          this.serviceDescription = ''
          this.isOneServiceSelected = true
        }
      })
    },
    goNext () {
      const selectedServices = []
      this.selectedServicesBoolean.forEach((element, index) => {
        if (element) {
          selectedServices.push(this.services[index])
        }
      })
      this.$emit('goNext', selectedServices, this.serviceDescription)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
