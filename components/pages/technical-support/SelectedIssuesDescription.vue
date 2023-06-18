<template>
  <div>
    <BookingHeader header-text="Please enter any additional details" :selection="true" @goBack="$emit('goBack')" @goNext="goNext" />
    <div class="relative lg:w-5/12 sm:w-8/12 w-full mx-auto shadow-md border-light-gray border-2 p-6 rounded-md mt-4 mb-8">
      <ValidationObserver v-slot="{ handleSubmit }" ref="descriptionValidator">
        <form @submit.prevent="handleSubmit(onSubmit)">
          <div class="my-3">
            <ValidationProvider
              v-slot="{ errors }"
              name="text"
            >
              <label class="text-sm text-gray-500">
                Additional details (Optional)
              </label>
              <textarea
                v-model="form.description"
                type="text"
                :class="errors[0] ? 'border-logo-red focus:border-logo-red' : 'border-light-gray text-dark-gray'"
                class="w-full border outline-none p-3 bg-gray-50 text-sm"
                rows="5"
              />
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
        description: ''
      }
    }
  },
  methods: {
    goNext () {
      this.$refs.descriptionValidator.validate().then((success) => {
        if (success) {
          this.$emit('goNext', this.form)
        }
      })
    }
  }
}
</script>
