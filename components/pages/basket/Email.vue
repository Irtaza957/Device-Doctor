<template>
  <div>
    <BookingHeader :show-back-button="false" header-text="Please enter your email" :selection="true" @goBack="$emit('goBack')" @goNext="goNext" />
    <div class="relative lg:w-5/12 sm:w-8/12 w-full mx-auto shadow-md border-light-gray border-2 p-6 rounded-md mt-4 mb-8">
      <ValidationObserver v-slot="{ handleSubmit }" ref="emailValidator">
        <form @submit.prevent="handleSubmit(onSubmit)">
          <div class="my-3">
            <ValidationProvider
              v-slot="{ errors }"
              name="email"
              rules="required|email"
            >
              <label class="text-sm text-gray-500">
                Email address*
              </label>
              <input
                v-model="form.email"
                type="email"
                name="email"
                autocomplete="on"
                :class="errors[0] ? 'border-logo-red focus:border-logo-red' : 'border-light-gray text-dark-gray'"
                class="w-full border outline-none p-3 bg-gray-50 text-sm"
              >
            </ValidationProvider>
          </div>
        </form>
      </ValidationObserver>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        email: ''
      }
    }
  },
  methods: {
    goNext () {
      this.$refs.emailValidator.validate().then((success) => {
        if (success) {
          this.$cookies.set('DD_EMAIL', this.form.email, {
            maxAge: 60 * 60 * 24
          })
          this.$store.dispatch('cart/SET_CUSTOMER_CART_IN_DB', { isCompleted: false })
          this.$ga.event({
            eventCategory: 'Email Entered and Cart Reached',
            eventAction: 'action'
          })
          this.$emit('goNext', this.form)
        }
      })
    }
  }
}
</script>
