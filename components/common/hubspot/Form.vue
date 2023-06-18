<template>
  <div>
    <BookingHeader
      header-text="Please fill out your details"
      :is-header-text-uppercase="false"
      :show-next-button="false"
      :selection="true"
      @goBack="$emit('goBack')"
    />
    <div class="relative lg:w-5/12 sm:w-8/12 w-full mx-auto my-2">
      <p class="text-sm text-dark-gray text-center mb-2">
        We will need to find you a quote for this, please fill out your details and we will be in touch shortly!
      </p>
      <pre class="font-sans text-dark-gray text-sm" v-html="displayContent" />
    </div>
    <div class="relative lg:w-5/12 sm:w-8/12 w-full mx-auto shadow-md border-light-gray border-2 px-6 pb-6 rounded-md mb-8">
      <div v-if="loader">
        <ImageBoxSkeleton />
        <br>
        <ImageBoxSkeleton />
      </div>
      <div v-show="!loader">
        <div v-once id="hubspotForm" class="mt-8" />
        <input id="flowName" type="hidden" :value="flowName">
        <input id="ticketDesc" type="hidden" :value="formContent">
        <input id="postcode" type="hidden" :value="postcode">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    formContent: {
      type: String,
      default: () => ''
    },
    displayContent: {
      type: String,
      default: () => ''
    },
    flowName: {
      type: String,
      default: () => ''
    }
  },
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
          formId: '35eae451-da70-4d17-8478-c9f949f6c406',
          onFormReady ($form) {
            const postcode = document.getElementById('postcode').value
            $form.find('input[name="zip"]').val(postcode).change()
            app.loader = false
          },
          onFormSubmit ($form) {
            const firstname = $form.find('input[name="firstname"]').val()
            const lastname = $form.find('input[name="lastname"]').val()
            const flowName = document.getElementById('flowName').value
            const name = flowName + ' - ' + firstname + ' ' + lastname
            $form.find('input[name="TICKET.subject"]').val(name).change()
            const content = document.getElementById('ticketDesc').value
            $form.find('input[name="TICKET.content"]').val(content).change()
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
