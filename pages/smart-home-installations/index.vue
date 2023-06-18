<template>
  <div class="relative overflow-hidden">
    <Container>
      <!-- Services -->
      <template v-if="showView === 'services'">
        <Services @goBack="goBack" @goNext="goNextToForm" />
      </template>

      <!-- Form -->
      <template v-else-if="showView === 'form'">
        <HubspotForm :form-content="formContent" :display-content="displayContent" :flow-name="'Smart Home'" @goBack="goBack" />
      </template>

      <!-- Device Success -->
      <template v-else-if="showView === 'success'">
        <SuccessScreen />
      </template>
    </container>
  </div>
</template>

<script>
import Services from '@/components/pages/smart-home-installations/Services.vue'
import HubspotForm from '~/components/common/hubspot/Form.vue'

export default {
  components: {
    Services,
    HubspotForm
  },
  data: () => ({
    showView: 'services',
    // Services
    selectedServices: [],
    description: '',
    formContent: '',
    displayContent: ''
  }),

  methods: {
    goBack () {
      switch (this.showView) {
        case 'services':
          this.$router.push('/')
          break
        case 'form':
          this.showView = 'services'
          break
        default:
          break
      }
    },
    goNextToForm (selectedServices, description) {
      this.selectedServices = selectedServices
      this.description = description
      this.formContent = ''
      this.displayContent = ''
      if (this.description !== '') {
        this.formContent += 'Services Description: ' + this.description
        this.displayContent += 'Services Description: ' + this.description
      } else {
        this.formContent += 'Services:\n'
        this.displayContent += '<b>Services:</b>\n'
        this.selectedServices.forEach((element) => {
          this.formContent += element.name + '\n'
          this.displayContent += element.name + '\n'
        })
      }
      this.showView = 'form'
    }
  }
}
</script>
