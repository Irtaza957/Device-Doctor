<template>
  <div class="bg-error-gray py-16 px-5">
    <img src="@/assets/img/exlamation.svg" alt="exclamation" class="w-2/12 mx-auto">
    <h1 class="font-bold text-2xl text-center text-gray-500 capitalize">
      OOPS
    </h1>
    <h2 class="text-center font-medium text-gray-500 mt-4">
      Looks like there is nothing available to book. There might be any technical issue.
    </h2>
    <h2 class="text-center font-medium text-gray-500">
      Please contact us directly!
    </h2>
    <nuxt-link to="/contact">
      <div class="flex justify-center items-center mt-5">
        <button class="uppercase py-2 px-8 rounded-full font-semibold text-base md:text-lg bg-gray-500 hover:bg-gray-600 text-white transition ease-linear duration-300 cursor-pointer">
          Contact us
        </button>
      </div>
    </nuxt-link>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>

</style>
