<template>
  <div>
    <div class="sticky top-0 py-5 z-10">
      <div class="relative w-max ml-auto">
        <div
          class="relative flex justify-center items-center py-1 px-8 rounded-full border-4 bg-white border-logo-red font-semibold text-base md:text-lg hover:bg-logo-red hover:text-white transition ease-linear duration-300 cursor-pointer z-0"
          @click="$emit('nextStep')"
        >
          Next <font-awesome-icon :icon="['fas', 'angle-right']" class="ml-2" />
        </div>
        <div
          v-if="!selection"
          class="absolute top-0 left-0 h-full w-full bg-white bg-opacity-60 cursor-not-allowed z-10"
        />
      </div>
    </div>
    <div v-if="headerText" class="text-2xl text-center font-semibold text-dark-gray uppercase mt-5 md:mt-0">
      {{ headerText }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    selection: {
      type: Boolean,
      default: () => false
    },
    headerText: {
      type: String,
      default: () => ''
    }
  }
}
</script>
