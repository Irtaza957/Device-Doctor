<template>
  <div class="md:m-10 m-5 bg-light-blue bg-opacity-5 md:py-20 py-10 md:px-10 px-6">
    <div>
      <h1
        class="sm:text-3xl text-lg font-semibold leading-tight text-center text-dark-gray"
      >
        Please fill out your details below and we will get back to you shortly!
      </h1>
    </div>
    <div>
      <ValidationObserver v-slot="{ handleSubmit }">
        <form @submit.prevent="handleSubmit(onSubmit)">
          <div class="flex flex-col md:flex-row gap-x-16 md:my-8 my-0">
            <div class="flex flex-col w-full md:my-0 my-8">
              <label
                class="font-light"
              >First name<span class="text-logo-red">*</span></label>
              <ValidationProvider
                v-slot="{ errors }"
                name="First name"
                rules="required"
              >
                <input
                  v-model="form.fname"
                  type="text"
                  placeholder="Enter first name"
                  name="First name"
                  class="
                    w-full
                    py-3
                    px-6
                    outline-none
                    border
                    focus:border-footer-light-gray
                  "
                >
                <span class="text-red-500">{{ errors[0] }}</span>
              </ValidationProvider>
            </div>
            <div class="flex flex-col w-full my-0">
              <label
                class="font-light"
                for=""
              >Last name<span class="text-logo-red">*</span></label>
              <ValidationProvider
                v-slot="{ errors }"
                name="Last name"
                rules="required"
              >
                <input
                  v-model="form.lname"
                  type="text"
                  placeholder="Enter last name"
                  class="
                  w-full
                  py-3
                  px-6
                  outline-none
                  border
                  focus:border-footer-light-gray
                "
                >
                <span class="text-red-500">{{ errors[0] }}</span>
              </ValidationProvider>
            </div>
          </div>

          <div class="flex flex-col w-full my-8">
            <label class="font-light" for="">Phone number</label>
            <input
              v-model="form.phone"
              type="text"
              placeholder="Enter phone number"
              class="
                py-3
                px-6
                outline-none
                border
                focus:border-footer-light-gray
              "
            >
          </div>

          <div class="flex flex-col w-full my-8">
            <label
              class="font-light"
              for=""
            >Email<span class="text-logo-red">*</span></label>
            <ValidationProvider
              v-slot="{ errors }"
              name="Email"
              rules="required|email"
            >
              <input
                v-model="form.email"
                type="email"
                placeholder="Enter email"
                class="
              w-full
                py-3
                px-6
                outline-none
                border
                focus:border-footer-light-gray
              "
              >
              <span class="text-red-500">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>

          <div class="flex flex-col w-full my-8">
            <label class="font-light" for="">Postal code</label>
            <input
              v-model="form.postalCode"
              type="text"
              placeholder="Enter postal code"
              class="
                py-3
                px-6
                outline-none
                border
                focus:border-footer-light-gray
              "
            >
          </div>

          <div class="flex flex-col w-full my-8">
            <label
              class="font-light"
              for=""
            >Message<span class="text-logo-red">*</span></label>
            <ValidationProvider
              v-slot="{ errors }"
              name="Message"
              rules="required"
            >
              <textarea
                v-model="form.message"
                name="message"
                placeholder="Enter message"
                rows="6"
                class="w-full outline-none border focus:border-footer-light-gray py-3 px-6"
              />
              <span class="text-red-500">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>
          <div>
            <button
              type="submit"
              class="
                bg-light-blue
                text-white
                rounded-full
                py-2.5
                px-8
                md:my-8 my-6
                hover:shadow-2xl
                transition-all
                ease-in-out
                duration-500
              "
            >
              Submit
            </button>
          </div>
        </form>
      </ValidationObserver>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    form: {
      fname: '',
      lname: '',
      phone: '',
      email: '',
      postalCode: '',
      message: ''
    }
  }),
  methods: {
    onSubmit () {
    }
  }
}
</script>
