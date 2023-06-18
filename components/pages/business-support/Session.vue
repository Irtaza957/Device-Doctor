<template>
  <div>
    <div v-if="!loadingTimePrice">
      <div v-if="sessions">
        <Container>
          <BookingHeader header-text="Select session" :selection="selectedSession !== null" @goBack="$emit('goBack')" @goNext="$emit('goNext', selectedSession)" />
          <div class="list-wrapper flex flex-col justify-start items-center sm:w-max w-full h-72 overflow-y-scroll mx-auto rounded-lg shadow-md border py-2 px-5 my-5">
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
                  ${{ session.price }}
                </p>
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
        <BookingHeader header-text="Select session" :selection="selectedSession" @goBack="$emit('goBack')" @goNext="$emit('goNext')" />
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
const businessITSupportModule = createNamespacedHelpers('businessITSupport')

export default {
  data () {
    return {
      loadingTimePrice: false,
      selectedSession: null,
      sessions: null
    }
  },
  async created () {
    await this.fetchTimePrice()
  },
  methods: {
    ...businessITSupportModule.mapActions(['FETCH_BS_TIME_PRICE']),
    async fetchTimePrice () {
      try {
        this.loadingTimePrice = true
        const resp = await this.FETCH_BS_TIME_PRICE()
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
    }
  }
}
</script>
