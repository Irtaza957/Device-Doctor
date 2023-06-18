<template>
  <div class="fixed top-0 left-0 flex justify-center items-center h-full w-full bg-black bg-opacity-30 backdrop-filter backdrop-blur-md z-50">
    <div
      class="bg-white rounded shadow-lg w-80 sm:w-96"
      data-aos="flip-left"
      data-aos-duration="400"
    >
      <div class="px-5 py-3 border-b font-medium">
        Enter postcode
      </div>
      <ValidationObserver v-slot="{ handleSubmit }">
        <form class="p-5" @submit.prevent="handleSubmit(verifyCode)">
          <ValidationProvider
            v-slot="{ errors }"
            name="postcode"
            rules="required"
          >
            <input
              v-model="postcode"
              type="text"
              name="postcode"
              placeholder="Enter postcode"
              :class="errors[0] ? 'border-logo-red text-logo-red placeholder-logo-red focus:border-logo-red' : 'border-light-gray focus:border-light-blue text-dark-gray'"
              class="w-full py-2 px-3 border outline-none font-light"
            >
          </ValidationProvider>
          <div v-if="isValidCode === false" class="text-red-600 py-1 mt-1 text-xs">
            Please check your postcode and try again, if you entered it correctly, sorry it doesn't look like we cover your area quite yet.
          </div>
          <button
            class="px-4 py-2 flex ml-auto mt-4 gap-2 text-sm font-medium rounded-sm text-white bg-purple-500 hover:bg-purple-500/80"
            :disabled="!postcode"
            :class="[postcode ? 'cursor-pointer':'cursor-not-allowed', loadingPostcodes ? 'opacity-60':'opacity-100']"
          >
            <svg
              v-show="loadingPostcodes"
              class="w-5 h-5 text-white animate-spin"
              fill="none"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                fill="currentColor"
              />
            </svg>
            <span class="text-white">Enter</span>
          </button>
        </form>
      </ValidationObserver>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'

export default {
  data: () => ({
    postcode: '',
    isValidCode: null,
    loadingPostcodes: false
  }),
  methods: {
    ...mapActions(['GET_POST_CODES']),
    ...mapMutations(['SET_AUTHENTICATED']),
    verifyCode () {
      let code = this.postcode
      let flag = false
      code = code.replace(/\s/g, '')
      if (code.length === 6) {
        code = code.substring(0, 3)
        flag = true
      } else if (code.length === 7) {
        code = code.substring(0, 4)
        flag = true
      }
      if (flag) {
        this.isValidCode = true
        this.loadingPostcodes = true
        flag = false
        this.GET_POST_CODES()
          .then((response) => {
            const postcodes = response.data.data ? response.data.data : []
            postcodes.forEach((element) => {
              if (element.code.toLowerCase() === code.toLowerCase()) {
                flag = true
              }
            })
            if (flag) {
              this.SET_AUTHENTICATED(true)
              this.$cookies.set('DD_POSTAL_CODE', this.postcode, {
                maxAge: 60 * 60 * 24
              })
            } else {
              this.isValidCode = false
            }
            this.loadingPostcodes = false
          })
          .catch(() => {
            this.loadingPostcodes = false
            this.isValidCode = false
          })
      } else {
        this.isValidCode = false
      }
    }
  }
}
</script>
