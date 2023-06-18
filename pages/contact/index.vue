<template>
  <div>
    <div
      class="container mx-auto"
      data-aos="fade-down"
      data-aos-duration="600"
      data-aos-easing="ease-in-out"
    >
      <div class="py-8">
        <div class="text-2xl text-center font-semibold text-dark-gray mt-5 md:mt-0 mb-4">
          Please fill out your details
        </div>
        <div class="relative lg:w-5/12 sm:w-8/12 w-full mx-auto shadow-md border-light-gray border-2 px-6 pb-6 pt-6 rounded-md mb-8">
          <div v-if="loader">
            <ImageBoxSkeleton />
            <br>
            <ImageBoxSkeleton />
          </div>
          <div v-show="!loader">
            <div v-once id="hubspotForm" class="mt-8" />
            <input id="postcode" type="hidden" :value="postcode">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loader: false,
      postcode: ''
    }
  },
  mounted () {
    this.loader = true
    this.getPostcode()
    const script = document.createElement('script')
    script.src = 'https://js.hsforms.net/forms/shell.js'
    document.body.appendChild(script)
    script.addEventListener('load', () => {
      const app = this
      if (window.hbspt) {
        window.hbspt.forms.create({
          target: '#hubspotForm',
          region: 'na1',
          portalId: '8062204',
          formId: 'bc386c6f-b4bc-48f1-b6b8-7196e8c20593',
          onFormReady ($form) {
            const postcode = document.getElementById('postcode').value
            $form.find('input[name="zip"]').val(postcode).change()
            app.loader = false
          },
          onFormSubmit ($form) {
          }
        })
      }
    })
  },
  methods: {
    getPostcode () {
      const postcode = this.$cookies.get('DD_POSTAL_CODE')
      if (postcode) {
        this.postcode = postcode
      }
    }
  }
}
</script>
