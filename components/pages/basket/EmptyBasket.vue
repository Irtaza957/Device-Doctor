<template>
  <div class="py-16 px-5">
    <div class="mx-auto">
      <div class="flex items-center justify-center">
        <font-awesome-icon :icon="['fas', 'shopping-cart']" class="text-4xl text-gray-500" />
      </div>
    </div>
    <h1 class="font-bold text-xl text-center text-gray-500 upperccase mt-5">
      Your basket is empty
    </h1>
    <h2 class="text-center font-medium text-gray-500 mt-4 w-full sm:w-1/2 mx-auto">
      Once you have added items to your basket, you can check out from here.
    </h2>
    <nuxt-link to="/">
      <div class="flex justify-center items-center mt-5">
        <button class="uppercase py-1 px-20 font-semibold text-base md:text-lg bg-gray-500 hover:bg-gray-600 text-white transition ease-linear duration-300 cursor-pointer">
          Add Items
        </button>
      </div>
    </nuxt-link>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const cartModule = createNamespacedHelpers('cart')

export default {
  computed: {
    ...cartModule.mapState(['CART'])
  }
}
</script>

<style lang="scss" scoped>

</style>
