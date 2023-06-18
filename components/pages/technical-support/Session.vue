<template>
  <div>
    <div v-if="!loadingTimePrice">
      <div v-if="sessions">
        <Container>
          <BookingHeader header-text="How long would you like us for?" :selection="selectedSession !== null" @goBack="$emit('goBack')" @goNext="$emit('goNext', selectedSession)" />
          <div v-if="selectedIssues.length" class="flex flex-col justify-start items-center sm:w-96 w-full mx-auto py-2 px-2">
            <p class="w-full text-sm">
              Recommended time for this service: {{ getTimeInMinutes(selectedIssues) }} min
            </p>
          </div>
          <div class="list-wrapper flex flex-col justify-start items-center sm:w-max w-full h-72 overflow-y-scroll mx-auto rounded-lg shadow-md border py-2 px-5 mb-5 mt-4">
            <div
              v-for="(session, index) in sessions"
              :key="index"
              :class="
                selectedSession === session
                  ? ' border-logo-red'
                  : ' border-light-gray'
              "
              class="relative border-2 rounded-md sm:w-80 w-full my-1 cursor-pointer p-3"
              @click="selectedSession = session"
            >
              <div class="flex justify-between items-center text-sm">
                <h2 class="capitalize">
                  {{ session.time }}
                </h2>
                <p class="font-light">
                  &#163;{{ session.price }}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </div>
      <div v-else>
        <NoResultHubspotForm :flow-name="'Technical Support'" @goBack="$emit('goBack')" />
      </div>
    </div>
    <div v-else>
      <Container>
        <BookingHeader header-text="How long would you like us for?" :selection="selectedSession" @goBack="$emit('goBack')" @goNext="$emit('goNext')" />
        <div class="list-wrapper flex flex-col gap-3 justify-start items-center sm:w-max w-full h-72 overflow-y-scroll mx-auto rounded-lg shadow-md border py-2 px-5 my-5">
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
const technicalSupportModule = createNamespacedHelpers('technicalSupport')

export default {
  props: {
    selectedIssues: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      loadingTimePrice: false,
      selectedSession: null,
      sessions: null
    }
  },
  async created () {
    await this.fetchTimePrice()
    // console.log(this.selectedIssues)
  },
  methods: {
    ...technicalSupportModule.mapActions(['FETCH_T_S_TIME_PRICE']),
    async fetchTimePrice () {
      try {
        this.loadingTimePrice = true
        const resp = await this.FETCH_T_S_TIME_PRICE()
        if (resp.data.data.length) {
          this.sessions = resp.data.data
        } else {
          this.sessions = null
        }
        this.loadingTimePrice = false
      } catch (error) {
        this.sessions = null
        this.loadingTimePrice = false
      }
    },
    convertTimeInMinutes (data) {
      let time = 0
      switch (data) {
        case '30 min':
          time = 30
          break
        case '1 Hour':
          time = 60
          break
        case '1.5 Hour':
          time = 90
          break
        case '2 Hour':
          time = 120
          break
        case '2.5 Hour':
          time = 150
          break
        case '3 Hour':
          time = 180
          break
        case '3.5 Hour':
          time = 210
          break
        case '4 Hour':
          time = 240
          break
        case '15-30 min':
          time = 22
          break
        case '30-60 min':
          time = 45
          break
        case '1-2 Hour':
          time = 90
          break
        case '2-3 Hour':
          time = 150
          break
        case '1-3 Hour':
          time = 120
          break
        case '2-4 Hour':
          time = 180
          break
        case '3-4 Hour':
          time = 210
          break
        default:
          break
      }
      return time
    },
    getTimeInMinutes (selectedIssues) {
      let total = 0
      selectedIssues.forEach((element) => {
        total += this.convertTimeInMinutes(element.average_time)
      })
      return total
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
