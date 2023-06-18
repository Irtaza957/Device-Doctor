<template>
  <div>
    <header class="w-full transition-all ease-linear duration-500 z-40 absolute top-0 bg-dark-gray text-white">
      <Container>
        <nav class="relative h-16 md:h-20 flex justify-between items-center py-5">
          <!-- Logo -->
          <div class="w-full xl:w-auto flex justify-center xl:justify-start items-center">
            <a href="https://devicedoctors.co.uk/">
              <div class="flex items-center">
                <div class="w-6 sm:w-9 mr-1">
                  <img src="@/assets/img/home/logo.png" alt="logo">
                </div>
                <div>
                  <h1 class="uppercase text-lg sm:text-2xl xl:text-4xl font-bold">
                    Device <span class="text-logo-red">Doctors</span>
                  </h1>
                </div>
              </div>
            </a>
          </div>
          <!-- Mobile Nav -->
          <div class="absolute top-0 left-0 xl:hidden h-full">
            <div class="h-full flex flex-col justify-center items-start gap-1.5 cursor-pointer" @click="toggleNav">
              <span class="h-0.5 w-4 transition-all duration-500 bg-white" />
              <span class="h-0.5 w-6 transition-all duration-500 bg-white" />
              <span class="h-0.5 w-4 transition-all duration-500 bg-white" />
            </div>
            <div :class="sideNav ? 'translate-x-0' : '-translate-x-full' " class="fixed top-0 left-0 flex flex-col h-screen sm:w-80 w-full overflow-hidden bg-white text-black uppercase  transition-all duration-300 ease-in-out transform box-border z-50 ">
              <div class="flex items-center justify-end p-10 cursor-pointer" @click="toggleNav">
                <span class="normal-case mr-2">Close</span>
                <font-awesome-icon :icon="['fas','times']" class=" text-lg" />
              </div>
              <div class="w-full cursor-pointer">
                <p
                  class="bg-white text-dark-gray  border-b-6 border-t-6 border-logo-red  py-2  text-center "
                  @click="toggleModal"
                >
                  Sign up for a £10 Discount Code - Click here
                </p>
              </div>
              <a href="https://devicedoctors.co.uk/">
                <div class="border-t border-b border-gray-outline border-opacity-10 text-gray-outline py-2 px-10 -mt-px cursor-pointer" @click="toggleNav">
                  Home
                </div>
              </a>
              <nuxt-link to="/">
                <div class="border-t border-b border-gray-outline border-opacity-10 text-gray-outline py-2 px-10 -mt-px cursor-pointer" @click="toggleNav">
                  Booking
                </div>
              </nuxt-link>
              <nuxt-link
                to="/contact"
              >
                <div class="border-t border-b border-gray-outline border-opacity-10 text-gray-outline py-2 px-10 -mt-px cursor-pointer" @click="toggleNav">
                  Contact
                </div>
              </nuxt-link>
            </div>
          </div>
          <!-- Horizontal Nav -->
          <div class="horizontal-nav lg:gap-8 hidden xl:flex xl:gap-6 2xl:gap-14 items-center uppercase">
            <a href="https://devicedoctors.co.uk/">
              Home
            </a>
            <nuxt-link to="/">
              Booking
            </nuxt-link>
            <nuxt-link to="/contact">
              Contact
            </nuxt-link>
            <nuxt-link v-if="CART.totalDevices > 0" to="/basket" class="relative">
              <button class="text-sm py-3.5 px-9 border-2 rounded-full transition-all duration-500 bg-btn-gray border-gray-outline hover:bg-white hover:text-dark-gray hover:border-white">
                Go To Basket
              </button>
              <div class="absolute shadow-xl -top-1 -right-1 bg-green-400 rounded-full w-6 h-6 flex items-center justify-center">
                <p class="text-white text-center text-xs">
                  {{ CART.totalDevices }}
                </p>
              </div>
            </nuxt-link>
          </div>
          <!-- Cart (if any item is in cart) -->
          <div v-if="CART.totalDevices > 0" class="xl:hidden flex relative">
            <nuxt-link to="/basket">
              <font-awesome-icon :icon="['fas','shopping-cart']" class=" text-lg" />
            </nuxt-link>
            <div class="absolute shadow-xl -top-3 -right-3 bg-green-400 rounded-full w-5 h-5 flex items-center justify-center">
              <p class="text-white text-center text-xs">
                {{ CART.totalDevices }}
              </p>
            </div>
          </div>
        </nav>
      </Container>
      <!-- Discount bar -->
      <div v-if="true" class="border-b-6 border-t-6 h-12 flex justify-center items-center border-logo-red text-logo-red text-center p-1 font-bold sm:text-base text-sm">
        <Container>
          <p class="cursor-pointer" @click="toggleModal">
            Sign up for a £10 Discount Code - Click here
          </p>
        </Container>
      </div>
      <div v-else class="border-t-6 border-logo-red text-logo-red" />
    </header>
    <div :class="true ? 'mb-28 md:mb-32':'mb-16 md:mb-20'" />
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const cartModule = createNamespacedHelpers('cart')

export default {
  data: () => ({
    sideNav: false
  }),
  computed: {
    ...cartModule.mapState(['CART'])
  },
  methods: {
    toggleNav () {
      this.sideNav = !this.sideNav
    },
    toggleModal () {
      this.$emit('toggleModal')
      this.sideNav = false
    }
  }
}
</script>
