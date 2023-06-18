<template>
  <div class="fixed top-0 left-0 min-h-screen w-full flex justify-center items-center text-white bg-dark-gray bg-opacity-70 z-50">
    <Container>
      <div class="relative lg:w-6/12 md:w-9/12 w-11/12 mx-auto h-max bg-white text-dark-gray py-10 rounded-md">
        <SignupForm />
        <div class="absolute -top-3 -right-3 shadow-md h-8 w-8 rounded-full bg-white text-light-blue hover:text-dark-gray transition duration-300 ease-linear flex justify-center items-center cursor-pointer" @click="toggleModal">
          <font-awesome-icon :icon="['fas', 'times']" />
        </div>
      </div>
    </Container>
  </div>
</template>

<script>
import SignupForm from '@/components/common/modals/SignupForm.vue'

export default {
  components: {
    SignupForm
  },
  methods: {
    toggleModal () {
      this.$emit('toggle')
    }
  }

}
</script>
