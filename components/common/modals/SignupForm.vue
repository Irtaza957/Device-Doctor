<template>
  <Container>
    <div class="text-dark-gray">
      <h1 class="text-center text-xl font-semibold">
        £10 off your first order!
      </h1>
      <p
        class="text-sm mt-4 mb-6"
      >
        Sign up and we will email you instantly with a code you can use online for £10 off, we will also keep you updated with other offers.
      </p>
      <ValidationObserver v-slot="{ handleSubmit }">
        <form @submit.prevent="handleSubmit(onSubmit)">
          <div class="flex flex-col my-4">
            <label for="email" class="text-sm mb-1">Email</label>
            <ValidationProvider v-slot="{ errors }" name="Email" rules="required|email">
              <input
                id="email"
                v-model="formData.email"
                type="email"
                placeholder="Enter email"
                :class="errors[0] ? 'border-logo-red focus:border-logo-red' : 'border-light-purple focus:border-light-blue'"
                class="w-full py-2.5 px-3 border outline-none text-sm rounded-sm"
              >
            </ValidationProvider>
          </div>
          <div class="flex flex-col my-4">
            <label for="First-name" class="text-sm mb-1">First Name</label>
            <ValidationProvider v-slot="{ errors }" name="First name" rules="required">
              <input
                id="First-name"
                v-model="formData.fname"
                type="text"
                placeholder="Enter First name"
                :class="errors[0] ? 'border-logo-red focus:border-logo-red' : 'border-light-purple focus:border-light-blue'"
                class="w-full py-2.5 px-3 border outline-none text-sm rounded-sm"
              >
            </ValidationProvider>
          </div>
          <div class="flex flex-col my-4">
            <label for="Last-name" class="text-sm mb-1">Last Name</label>
            <ValidationProvider v-slot="{ errors }" name="Last name" rules="required">
              <input
                id="Last-name"
                v-model="formData.lname"
                type="text"
                placeholder="Enter Last name"
                :class="errors[0] ? 'border-logo-red focus:border-logo-red' : 'border-light-purple focus:border-light-blue'"
                class="w-full py-2.5 px-3 border outline-none text-sm rounded-sm"
              >
            </ValidationProvider>
          </div>
          <button
            class="text-sm bg-black hover:bg-dark-gray transition ease-linear duration-300 rounded-sm text-white py-2 px-4"
          >
            Subscribe
          </button>
        </form>
      </ValidationObserver>
      <p
        class="text-sm my-4"
      >
        Code only valid with online purchases. Offer can be withdrawn at any time.
      </p>
    </div>
  </Container>
</template>

<script>
export default {
  data: () => ({
    formData: {
      email: '',
      fname: '',
      lname: ''
    }
  }),
  methods: {
    onSubmit () {
    }
  }
}
</script>
