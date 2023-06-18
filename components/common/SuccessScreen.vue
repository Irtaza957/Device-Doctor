<template>
  <div>
    <div class="relative rounded py-5 px-8 w-full">
      <div class="absolute top-14 left-1/2 flex justify-center items-center h-14 w-14 bg-logo-red rounded-full transform -translate-x-1/2 -translate-y-1/2 pb-2">
        <div class="flex justify-center items-end transform -rotate-45 w-full">
          <span class="h-3 w-0.5 bg-white" />
          <span class="w-6 h-0.5 bg-white" />
        </div>
      </div>
      <div class="flex flex-col justify-center items-center mt-20">
        <h1 class="text-3xl text-logo-red font-light mb-2">
          Awesome
        </h1>
        <p class="text-btn-gray leading-5 text-center">
          Your booking has been confirmed.<br>Our team will be in touch with you soon
        </p>
        <a href="https://devicedoctors.co.uk">
          <div
            class="relative flex justify-center items-center py-1 px-8 mt-8 rounded-full border-2 bg-white border-logo-red font-semibold text-base md:text-lg hover:bg-logo-red hover:text-white transition ease-linear duration-300 cursor-pointer z-0"
          >
            <font-awesome-icon :icon="['fas', 'angle-left']" class="mr-2" />Back To Home
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>

</style>
