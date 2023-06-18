<template>
  <div>
    <div class="flex justify-between py-2 md:py-5 z-20">
      <div v-if="showBackButton" class="relative w-max">
        <div
          class="relative flex justify-center items-center py-1 px-8 rounded-full border-4 bg-white border-logo-red font-semibold text-base md:text-lg hover:bg-logo-red hover:text-white transition ease-linear duration-300 cursor-pointer z-0"
          @click="$emit('goBack')"
        >
          <font-awesome-icon :icon="['fas', 'angle-left']" class="mr-2" />Back
        </div>
      </div>
      <div v-if="showNextButton && !isEdit" class="relative w-max ml-auto">
        <div
          class="relative flex justify-center items-center py-1 px-8 rounded-full border-4 bg-white border-logo-red font-semibold text-base md:text-lg hover:bg-logo-red hover:text-white transition ease-linear duration-300 cursor-pointer z-0"
          @click="$emit('goNext')"
        >
          Next <font-awesome-icon :icon="['fas', 'angle-right']" class="ml-2" />
        </div>
        <div
          v-if="!selection"
          class="absolute top-0 left-0 h-full w-full bg-white bg-opacity-60 cursor-not-allowed z-10"
        />
      </div>
      <div v-else-if="showNextButton" class="relative w-max ml-auto">
        <div
          class="relative flex justify-center items-center py-1 px-8 rounded-full border-4 bg-white border-logo-red font-semibold text-base md:text-lg hover:bg-logo-red hover:text-white transition ease-linear duration-300 cursor-pointer z-0"
          @click="$emit('goNext')"
        >
          Update <font-awesome-icon :icon="['fas', 'angle-right']" class="ml-2" />
        </div>
        <div
          v-if="!selection"
          class="absolute top-0 left-0 h-full w-full bg-white bg-opacity-60 cursor-not-allowed z-10"
        />
      </div>
    </div>
    <div class="text-xl md:text-2xl text-center font-semibold text-dark-gray mt-2 md:mt-0" :class="isHeaderTextUppercase ? 'uppercase':''">
      {{ headerText }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    headerText: {
      type: String,
      default: () => ''
    },
    isHeaderTextUppercase: {
      type: Boolean,
      default: () => false
    },
    isEdit: {
      type: Boolean,
      default: () => false
    },
    showBackButton: {
      type: Boolean,
      default: () => true
    },
    showNextButton: {
      type: Boolean,
      default: () => true
    },
    selection: {
      type: Boolean,
      default: () => false
    }
  }
}
</script>
