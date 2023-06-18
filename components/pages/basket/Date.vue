<template>
  <div>
    <BookingHeader header-text="When should we get to you?" :is-header-text-uppercase="false" :selection="selectedDate.date !== null" @goBack="$emit('goBack')" @goNext="$emit('goNext', selectedDate)" />
    <div>
      <div class="text-center  text-dark-gray mt-4 mb-8 ">
        <p class="mb-2 sm:text-base text-sm">
          Here’s the next available dates:
        </p>
        <div class="flex items-center lg:w-8/12 w-full mx-auto ">
          <p class="sm:text-sm text-xs text-footer-gray ml-2 text-center">
            We will send a 2 hour time window the evening before your selected repair date letting you know when we will be with you. We can come to you at home or at work.
          </p>
        </div>
      </div>
      <div :class="shownDates.length ? 'h-72 shadow-md overflow-y-scroll' : 'h-0 overflow-hidden' " class="list-wrapper flex flex-col justify-start items-center sm:w-max  mx-auto rounded-lg py-2 px-5 my-5">
        <div
          v-for="(dt, index) in shownDates"
          :key="index"
          class="relative my-1.5 rounded-md"
        >
          <div
            :class="[( selectedDate.date === dt.date
              ? ' border-logo-red'
              : ' border-light-gray'
            )]"
            class="border-2 rounded-md sm:w-80 w-full font-light text-sm py-2 px-5 cursor-pointer"
            @click="selectedDate = dt"
          >
            {{ dt.formatedDate }}

            <div v-if="selectedDate.date === dt.date" class="absolute top-1/2 right-5 transform -translate-y-1/2">
              <font-awesome-icon :icon="['fas','check']" />
            </div>
          </div>
          <!-- <div v-if="bookedDates.includes(dt.date)" class="absolute top-0 left-0 h-full w-full bg-gray-200 bg-opacity-60 rounded-md" /> -->
        </div>
      </div>
      <!-- load more dates -->
      <div class="flex items-center gap-2 border border-black py-1.5 px-4 rounded-full hover:bg-black hover:text-white w-max mx-auto transition-all duration-300 ease-linear font-light text-sm mt-3 mb-5 cursor-pointer " @click="getDates()">
        Load More Dates
        <font-awesome-icon v-if="isLoadingDates" :icon="['fas','spinner']" class="spinner" />
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import moment from 'moment'
const calendarModule = createNamespacedHelpers('calendar')
export default {
  data: () => ({
    date: new Date(),
    selectedDate: {
      date: null,
      formatedDate: null
    },
    isLoadingDates: false,
    shownDates: [],
    dbDates: []
  }),
  async created () {
    await this.showAllCalender()
    this.getDates()
    this.$ga.event({
      eventCategory: 'Date Page Reached',
      eventAction: 'action'
    })
  },
  methods: {
    ...calendarModule.mapActions(['FETCH_EVENTS', 'SHOW_ALL_CALENDER', 'FETCH_EVENTS_BY_DATE']),

    async getDates () {
      this.isLoadingDates = true
      const tempDates = []
      for (let index = 0; index < 7; index++) {
        // Increming date
        this.date = moment(this.date).add(1, 'days')

        // Verify date from database and then add date
        const dbDate = this.isExists(moment(this.date).format('YYYY-MM-DD'))
        if (dbDate) {
          // If the status for that date is enable
          if (dbDate.status === 1) {
            const isSlotAvailable = await this.isFiveHoursCompleted(moment(this.date).format('YYYY-MM-DD'))
            if (isSlotAvailable) {
              tempDates.push({ date: moment(this.date).format('YYYY-MM-DD'), formatedDate: moment(this.date).format('dddd, Do MMMM'), repairDate: moment(this.date).format('YYYY-MM-DD') })
            }
          }
        } else if (moment(this.date).format('dddd') !== 'Saturday' && moment(this.date).format('dddd') !== 'Sunday') { // Normal flow for adding dates
          const isSlotAvailable = await this.isFiveHoursCompleted(moment(this.date).format('YYYY-MM-DD'))
          if (isSlotAvailable) {
            tempDates.push({ date: moment(this.date).format('YYYY-MM-DD'), formatedDate: moment(this.date).format('dddd, Do MMMM'), repairDate: moment(this.date).format('YYYY-MM-DD') })
          }
        }
      }
      this.shownDates = [...this.shownDates, ...tempDates]
      this.isLoadingDates = false
    },
    async showAllCalender () {
      const resp = await this.SHOW_ALL_CALENDER()
      this.dbDates = resp.data.data
    },
    isExists (date) {
      let flag = false
      this.dbDates.forEach((element) => {
        if (element.date === date) {
          flag = element
        }
      })
      return flag
    },
    async isFiveHoursCompleted (date) {
      const resp = await this.FETCH_EVENTS_BY_DATE({ startDateTime: date })
      const events = resp.data.data.filter(event => event.googleEvent.creator.email === process.env.GOOGLE_SERVICE_ACCOUNT)
      // Calculate minutes of previously inserted events
      let totalMinutes = 0
      events.forEach((element) => {
        const duration = moment.duration(moment(element.googleEvent.end.dateTime).diff(moment(element.googleEvent.start.dateTime)))
        totalMinutes += duration.asMinutes()
      })
      // 300 min === 5 hours
      if (totalMinutes >= 300) {
        return false
      }
      return true
    }
  }
}
</script>

<style lang="scss" scoped>
.spinner {
  transform: scale(0);
  animation: spin 1.2s linear infinite;
  transition: all .2s ease-in-out;
}

@keyframes spin {
  0%{
    transform: rotate(0deg);
  }
  100%{
    transform: rotate(360deg);
  }
}
</style>
