<template>
  <div>
    <div v-if="!loadingServices">
      <div v-if="services">
        <BookingHeader header-text="Select or describe your smart home needs" :selection="canGoNext" @goBack="$emit('goBack')" @goNext="goNext" />
        <div class="list-wrapper flex flex-col justify-start items-center sm:w-max w-full h-72 overflow-y-scroll mx-auto rounded-lg shadow-md border py-2 px-5 my-5">
          <div
            v-for="(service, index) in services"
            :key="index"
            :class="
              selectedIssuesBoolean[index]
                ? ' border-logo-red'
                : ' border-light-gray'
            "
            class="relative border-2 rounded-md sm:w-80 w-full my-2 cursor-pointer p-3"
            @click="selectService(index)"
          >
            <div class="flex justify-between items-start">
              <h2 class="uppercase">
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
            <h2 class="text-2xl text-center font-semibold text-dark-gray mt-5 mb-2">
              Or describe your issue here
            </h2>
            <textarea
              v-model="description"
              rows="3"
              placeholder="Please describe here"
              class="border-light-gray focus:border-light-blue text-dark-gray w-full border outline-none p-3 rounded-lg shadow-md"
            />
          </div>
        </div>
      </div>
      <div v-else>
        <NoResultHubspotForm :flow-name="'Smart Home'" @goBack="$emit('goBack')" />
      </div>
    </div>
    <div v-else>
      <BookingHeader header-text="Select or describe your smart home needs" :selection="isOneIssueSelected" @goBack="$emit('goBack')" @goNext="$emit('goNext')" />
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
const smartHomeModule = createNamespacedHelpers('smartHome')

export default {
  data () {
    return {
      loadingServices: false,
      selectedIssuesBoolean: [],
      services: [],
      isOneIssueSelected: false,
      description: ''
    }
  },
  computed: {
    canGoNext () {
      return this.isOneIssueSelected || this.description.length > 0
    }
  },
  watch: {
    description (val) {
      if (val.length > 0) {
        this.selectedIssuesBoolean = this.services.map(() => {
          return false
        })
        this.isOneIssueSelected = false
      }
    }
  },
  async created () {
    await this.getSmartHomeParts()
  },
  methods: {
    ...smartHomeModule.mapActions(['FETCH_SMART_HOME_PARTS']),

    async getSmartHomeParts () {
      try {
        this.loadingServices = true
        const resp = await this.FETCH_SMART_HOME_PARTS()
        if (resp.data.data.length) {
          this.services = resp.data.data
        } else {
          this.services = null
        }
        this.selectedIssuesBoolean = this.services.map(() => {
          return false
        })
        this.loadingServices = false
      } catch (error) {
        this.services = null
        this.loadingServices = false
      }
    },
    selectService (index) {
      this.$set(this.selectedIssuesBoolean, index, !this.selectedIssuesBoolean[index])
      this.isOneIssueSelected = false
      this.selectedIssuesBoolean.forEach((element) => {
        if (element) {
          this.description = ''
          this.isOneIssueSelected = true
        }
      })
    },
    goNext () {
      const selectedServices = []
      this.services.forEach((element, index) => {
        if (this.selectedIssuesBoolean[index]) {
          selectedServices.push(this.services[index])
        }
      })
      this.$emit('goNext', selectedServices, this.description)
    }
  }
}
</script>
