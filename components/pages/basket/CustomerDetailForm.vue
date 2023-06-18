<template>
  <div>
    <BookingHeader header-text="Where should we go?" :selection="true" @goBack="goBack" @goNext="goNext" />
    <div class="flex items-center lg:w-8/12 w-full mx-auto mt-2">
      <p class="text-xs text-footer-gray ml-2 text-center">
        This is the primary address you would like us to come to, our service hours are between 9:00 and 17:00.
        <br>We will provide a 2-hour time window to you the evening before repair.
        If you need us to go elsewhere locally, let us know when you receive your timeslot.
      </p>
    </div>
    <div class="relative lg:w-5/12 sm:w-8/12 w-full mx-auto shadow-md border-light-gray border-2 p-6 rounded-md mt-4 mb-8">
      <ValidationObserver v-slot="{ handleSubmit }" ref="contactFormValidator">
        <form @submit.prevent="handleSubmit(onSubmit)">
          <div class="my-3">
            <ValidationProvider
              v-slot="{ errors }"
              name="firstname"
              rules="required"
            >
              <label class="text-sm text-gray-500">
                First name*
              </label>
              <input
                v-model="form.firstname"
                type="text"
                name="firstname"
                autocomplete="on"
                :class="errors[0] ? 'border-logo-red focus:border-logo-red' : 'border-light-gray text-dark-gray'"
                class="w-full border outline-none p-3 bg-gray-50 text-sm"
              >
            </ValidationProvider>
          </div>
          <div class="my-3">
            <ValidationProvider
              v-slot="{ errors }"
              name="lastname"
              rules="required"
            >
              <label class="text-sm text-gray-500">
                Last name*
              </label>
              <input
                v-model="form.lastname"
                type="text"
                name="lastname"
                autocomplete="on"
                :class="errors[0] ? 'border-logo-red focus:border-logo-red' : 'border-light-gray text-dark-gray'"
                class="w-full border outline-none p-3 bg-gray-50 text-sm"
              >
            </ValidationProvider>
          </div>
          <div class="my-3">
            <ValidationProvider
              v-slot="{ errors }"
              name="address1"
              rules="required"
            >
              <label class="text-sm text-gray-500">
                Address Line 1*
              </label>
              <input
                v-model="form.address1"
                type="text"
                name="address1"
                autocomplete="on"
                placeholder="e.g. Flat 5, Duck Lane"
                :class="errors[0] ? 'border-logo-red focus:border-logo-red' : 'border-light-gray text-dark-gray'"
                class="w-full border outline-none p-3 bg-gray-50 text-sm"
              >
            </ValidationProvider>
          </div>
          <div class="my-3">
            <ValidationProvider
              name="address2"
            >
              <label class="text-sm text-gray-500">
                Address Line 2
              </label>
              <input
                v-model="form.address2"
                type="text"
                name="address2"
                autocomplete="on"
                class="w-full border outline-none p-3 bg-gray-50 text-sm"
              >
            </ValidationProvider>
          </div>
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
              <span class="text-xs text-gray-500">
                We will use this to send you a conformation and timeslot.
              </span>
            </ValidationProvider>
          </div>
          <div class="my-3">
            <ValidationProvider
              v-slot="{ errors }"
              :rules="{ required: true ,regex:/((\+44(\s\(0\)\s|\s0\s|\s)?)|0)7\d{3}(\s)?\d{6}/g }"
              name="phone"
            >
              <label class="text-sm text-gray-500">
                Phone number (ideally mobile)*
              </label>
              <input
                v-model="form.phone"
                type="text"
                name="phone"
                autocomplete="on"
                :class="errors[0] ? 'border-logo-red focus:border-logo-red' : 'border-light-gray text-dark-gray'"
                class="w-full border outline-none p-3 bg-gray-50 text-sm"
              >
              <span class="text-xs text-gray-500">
                We’ll send the same as we did via email.
              </span>
            </ValidationProvider>
          </div>
          <div class="flex flex-col my-3">
            <ValidationProvider
              v-slot="{ errors }"
              name="postcode"
              rules="required"
            >
              <label class="text-sm text-gray-500">
                Postcode
              </label>
              <input
                v-model="form.postcode"
                type="text"
                name="postcode"
                autocomplete="on"
                placeholder="e.g. PO12 3dy"
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
        firstname: '',
        lastname: '',
        address1: '',
        address2: '',
        email: '',
        phone: '',
        postcode: ''
      }
    }
  },
  mounted () {
    this.getCustomerDetails()
  },
  methods: {
    getEmailAndPostcode () {
      const email = this.$cookies.get('DD_EMAIL')
      if (email) {
        this.form.email = email
      }
      const postcode = this.$cookies.get('DD_POSTAL_CODE')
      if (postcode) {
        this.form.postcode = postcode
      }
    },
    getCustomerDetails () {
      let customerDetail = localStorage.getItem('DD_CUSTOMER_DETAIL')
      if (customerDetail) {
        customerDetail = JSON.parse(customerDetail)
        this.form.firstname = customerDetail.firstname
        this.form.lastname = customerDetail.lastname
        this.form.address1 = customerDetail.address1
        this.form.address2 = customerDetail.address2
        this.form.phone = customerDetail.phone
        this.form.postcode = customerDetail.postcode
        this.form.email = customerDetail.email
      } else {
        this.getEmailAndPostcode()
      }
    },
    goNext () {
      this.$refs.contactFormValidator.validate().then((success) => {
        if (success) {
          localStorage.setItem('DD_CUSTOMER_DETAIL', JSON.stringify(this.form))
          this.$emit('goNext', this.form)
        }
      })
    },
    goBack () {
      localStorage.setItem('DD_CUSTOMER_DETAIL', JSON.stringify(this.form))
      this.$emit('goBack')
    }
  }
}
</script>
