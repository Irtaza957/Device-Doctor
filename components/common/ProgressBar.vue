<template>
  <div class="my-4 border-b-2 pb-4">
    <div class="flex">
      <div class="flex-1" />
      <div class="flex-1 flex flex-col">
        <div class="w-10 h-10 bg-green-400 mx-auto rounded-full text-lg text-white flex items-center">
          <span class="text-white text-center w-full">
            <span v-if="!deviceCompleted">1</span>
            <span v-else><font-awesome-icon :icon="['fas', 'check']" /></span>
          </span>
        </div>
        <div>
          <p class="text-xs text-center mt-4">
            Device
          </p>
        </div>
      </div>

      <div class="w-1/6 h-10 align-center items-center align-middle content-center flex">
        <div class="w-full bg-gray-200 rounded items-center align-middle align-center flex-1">
          <div class="bg-green-400 text-xs leading-none py-1 text-center text-grey-darkest rounded " :style="`width: ${deviceWidth}%`" />
        </div>
      </div>

      <div class="flex-1 flex flex-col">
        <div class="w-10 h-10 border-2 border-gray-200 mx-auto rounded-full text-lg flex items-center" :class="deviceCompleted ? 'bg-green-400': 'bg-white '">
          <span class="text-center w-full" :class="deviceCompleted ? 'text-white': 'text-black'">
            <span v-if="!basketCompleted">2</span>
            <span v-else><font-awesome-icon :icon="['fas', 'check']" /></span>
          </span>
        </div>
        <div>
          <p class="text-xs text-center mt-4">
            Basket
          </p>
        </div>
      </div>

      <div class="w-1/6 h-10 align-center items-center align-middle content-center flex">
        <div class="w-full bg-gray-200 rounded items-center align-middle align-center flex-1">
          <div class="bg-green-400 text-xs leading-none py-1 text-center text-grey-darkest rounded " :style="`width: ${basketBar}%`" />
        </div>
      </div>

      <div class="flex-1 flex flex-col">
        <div class="w-10 h-10 border-2 border-gray-200 mx-auto rounded-full text-lg text-white flex items-center" :class="basketCompleted ? 'bg-green-400': 'bg-white'">
          <span class="text-center w-full" :class="basketCompleted ? 'text-white': 'text-black'">
            <span v-if="!dateCompleted">3</span>
            <span v-else><font-awesome-icon :icon="['fas', 'check']" /></span>
          </span>
        </div>
        <div>
          <p class="text-xs text-center mt-4">
            Date
          </p>
        </div>
      </div>

      <div class="w-1/6 h-10 align-center items-center align-middle content-center flex">
        <div class="w-full bg-gray-200 rounded items-center align-middle align-center flex-1">
          <div class="bg-green-400 text-xs leading-none py-1 text-center text-grey-darkest rounded " :style="`width: ${dateBar}%`" />
        </div>
      </div>

      <div class="flex-1 flex flex-col">
        <div class="w-10 h-10 border-2 border-grabg-gray-200 mx-auto rounded-full text-lg text-white flex items-center" :class="dateCompleted ? 'bg-green-400': 'bg-white'">
          <span class="text-center w-full" :class="dateCompleted ? 'text-white': 'text-black'">
            <span v-if="!locationCompleted">4</span>
            <span v-else><font-awesome-icon :icon="['fas', 'check']" /></span>
          </span>
        </div>
        <div>
          <p class="text-xs text-center mt-4">
            Location
          </p>
        </div>
      </div>

      <div class="w-1/6 h-10 align-center items-center align-middle content-center flex">
        <div class="w-full bg-gray-200 rounded items-center align-middle align-center flex-1">
          <div class="bg-green-400 text-xs leading-none py-1 text-center text-grey-darkest rounded " :style="`width: ${locationBar}%`" />
        </div>
      </div>

      <div class="flex-1 flex flex-col">
        <div class="w-10 h-10 border-2 border-grabg-gray-200 mx-auto rounded-full text-lg text-white flex items-center" :class="locationCompleted ? 'bg-green-400': 'bg-white '">
          <span class="text-center w-full" :class="locationCompleted ? 'text-white': 'text-black'">
            <span v-if="true">5</span>
            <span v-else><font-awesome-icon :icon="['fas', 'check']" /></span>
          </span>
        </div>
        <div>
          <p class="text-xs text-center mt-4">
            Checkout
          </p>
        </div>
      </div>

      <div class="flex-1" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    deviceWidth: {
      type: Number,
      default: () => 0
    },
    deviceCompleted: {
      type: Boolean,
      default: () => false
    },
    basketCompleted: {
      type: Boolean,
      default: () => false
    },
    dateCompleted: {
      type: Boolean,
      default: () => false
    },
    locationCompleted: {
      type: Boolean,
      default: () => false
    }
  },
  computed: {
    basketBar () {
      if (this.basketCompleted) {
        return 100
      }
      return 0
    },
    dateBar () {
      if (this.dateCompleted) {
        return 100
      }
      return 0
    },
    locationBar () {
      if (this.locationCompleted) {
        return 100
      }
      return 0
    }
  }
}
</script>
