<template>
  <Container>
    <div id="about" class="flex flex-col-reverse lg:flex-row justify-center md:mt-24 mt-16 ">
      <div class="pr-2 lg:mt-0 mt-12">
        <div
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-easing="ease-in-out"
        >
          <h1 class="font-semibold text-3xl sm:text-4xl text-logo-red mb-0 sm:mb-2">
            {{ aboutData.heading }}
          </h1>
          <h1 class="font-semibold text-3xl sm:text-4xl text-dark-blue">
            {{ aboutData.subHeading }}
          </h1>
        </div>
        <div class="my-7">
          <p
            class=" text-light-blue leading-7"
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-easing="ease-in-out"
          >
            {{ aboutData.detail1 }}
          </p>
          <p
            v-if="aboutData.detail2"
            class="text-light-blue leading-7"
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-easing="ease-in-out"
          >
            {{ aboutData.detail2 }}
          </p>
        </div>
        <p
          class="text-light-blue mb-8"
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-easing="ease-in-out"
        >
          {{ aboutData.detail3 }}
        </p>
        <div>
          <div
            v-for="(point, index) in aboutData.points"
            :key="index"
            class="flex items-center"
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-easing="ease-in-out"
          >
            <div class="flex justify-center items-center h-5 w-5 rounded-full flex-shrink-0 border-2 border-tree-green text-tree-green mr-4 text-xs my-3  ">
              <font-awesome-icon :icon="[point.iconType, point.icon]" class="" />
            </div>
            <p class="text-lg font-medium text-dark-blue">
              {{ point.text }}
            </p>
          </div>
        </div>
        <div
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-easing="ease-in-out"
        >
          <nuxt-link v-scroll-to="'#hero-area'" to="/">
            <button

              class="bg-transparent w-full lg:w-auto rounded-full text-sm font-semibold text-btn-gray border border-btn-gray py-3 px-8 mt-8 hover:bg-dark-gray hover:text-white transition ease-in-out duration-500 hover:shadow-3xl"
            >
              {{ aboutData.btn }}
            </button>
          </nuxt-link>
        </div>
      </div>
      <div
        class="lg:w-1/2 w-full flex-shrink-0 lg:pl-11 pl-0 "
        data-aos="fade-up"
        data-aos-duration="1000"
        data-aos-easing="ease-in-out"
      >
        <div class="relative w-full lg:w-80 lg:ml-auto ml-0 z-10 animate-motion">
          <img src="@/assets/img/home/about2.jpg" class="w-full">
        </div>
        <div class="relative hidden lg:block w-full z-0 -mt-52 animate-motion-reverse pr-16 xl:pr-0">
          <img src="@/assets/img/home/about.jpg" alt="">
        </div>
      </div>
    </div>
  </Container>
</template>
<script>
export default {
  props: {
    aboutData: {
      type: Object,
      default: () => {}
    }
  }
}
</script>
