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
      <p v-if="selectedCategory">
        Category: {{ selectedCategory.name }}
      </p>
      <p v-if="selectedBrand">
        Brand: {{ selectedBrand.name }}
      </p>
      <p v-if="selectedModel">
        Model: {{ selectedModel.name }}
      </p>
      <p v-if="selectedColor">
        Color: {{ selectedColor.name }}
      </p>
      <p v-if="issueDescription">
        Description: {{ issueDescription }}
      </p>
      <div v-if="GET_CART.mobileTablet.length">
        <div v-for="(item, index) in GET_CART.mobileTablet" :key="index">
          <p>Issue # {{ index + 1 }}</p>
          <p>Category: {{ item.subcategory.name }}</p>
          <p>Brand: {{ item.brand.name }}</p>
          <p>Model: {{ item.model.name }}</p>
          <p>Color: {{ item.color.name }}</p>
          <p class="font-bold">
            Parts List:
          </p>
          <div class="flex flex-wrap gap-2">
            <div v-for="(issue, issueIndex) in item.issues" :key="issueIndex">
              <span class="inline-block">{{ issue.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="relative lg:w-5/12 sm:w-8/12 w-full mx-auto shadow-md border-light-gray border-2 px-6 py-6 rounded-md mb-8">
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
import { createNamespacedHelpers } from 'vuex'

const cartModule = createNamespacedHelpers('cart')
export default {
  props: {
    flowName: {
      type: String,
      default: () => ''
    },
    issueDescription: {
      type: String,
      default: () => ''
    },
    selectedCategory: {
      type: Object,
      default: () => {}
    },
    selectedBrand: {
      type: Object,
      default: () => {}
    },
    selectedModel: {
      type: Object,
      default: () => {}
    },
    selectedColor: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      loader: false,
      postcode: '',
      formContent: ''
    }
  },
  computed: {
    ...cartModule.mapGetters(['GET_CART'])
  },
  mounted () {
    this.loader = true
    this.getPostcode()
    this.setTicketDescription()
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
    },
    setTicketDescription () {
      this.formContent = ''
      this.formContent += this.selectedCategory ? 'Category: ' + this.selectedCategory.name : ''
      this.formContent += this.selectedBrand ? 'Brand: ' + this.selectedBrand.name : ''
      this.formContent += this.selectedModel ? 'Model: ' + this.selectedModel.name : ''
      this.formContent += this.selectedColor ? 'Color: ' + this.selectedColor.name : ''
      this.formContent += this.issueDescription ? 'Description: ' + this.issueDescription : ''
      if (this.GET_CART.mobileTablet.length) {
        this.formContent += '\nIssues in the Basket:'
        this.GET_CART.mobileTablet.forEach((element, index) => {
          this.formContent += `\nIssue # ${index + 1}: `
          this.formContent += '\n\tCategory: ' + element.subcategory.name
          this.formContent += '\n\tBrand: ' + element.brand.name
          this.formContent += '\n\tModel: ' + element.model.name
          this.formContent += '\n\tColor: ' + element.color.name
          this.formContent += '\n\tParts List:'
          element.issues.forEach((item) => {
            this.formContent += '\n\t\t' + item.name
          })
        })
      }
    }
  }
}
</script>
