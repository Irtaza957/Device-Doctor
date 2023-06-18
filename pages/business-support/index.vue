<template>
  <div class="relative overflow-hidden">
    <Container>
      <!-- Progress Bar -->
      <template v-if="showView === 'issues' || showView === 'session'">
        <ProgressBar :device-width="deviceWidth" :device-completed="false" />
      </template>
      <!-- Services -->
      <template v-if="showView === 'services'">
        <Services @goNext="goNextToForm" @goBack="goBack" @goToIssues="goToIssues" />
      </template>
      <!-- Form -->
      <template v-if="showView === 'form'">
        <HubspotForm :form-content="formContent" :display-content="displayContent" :flow-name="'Business Support'" @goBack="goBack" />
      </template>
      <!-- Success -->
      <template v-else-if="showView === 'success'">
        <SuccessScreen />
      </template>

      <!-- Issues -->
      <template v-else-if="showView === 'issues'">
        <Issues :is-edit="isEdit" @goBack="goBack" @goNext="goNextToSession" />
      </template>
      <!-- Session -->
      <template v-else-if="showView === 'session'">
        <Session @goBack="goBack" @goNext="goNextToBasket" />
      </template>
    </Container>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import Services from '~/components/pages/business-support/Services.vue'
import HubspotForm from '~/components/common/hubspot/Form.vue'
import Issues from '~/components/pages/business-support/Issues.vue'
import Session from '~/components/pages/business-support/Session.vue'
import ProgressBar from '~/components/common/ProgressBar.vue'

const businessITSupportModule = createNamespacedHelpers('businessITSupport')
const cartModule = createNamespacedHelpers('cart')

export default {
  components: {
    Services,
    HubspotForm,
    Issues,
    Session,
    ProgressBar
  },
  data: () => ({
    showView: 'services',
    lastView: null,
    // Service
    selectedServices: [],
    serviceDescription: '',
    // Issues
    selectedIssues: null,
    issueDescription: '',
    isEdit: false,
    // Session
    selectedSession: null,
    // Form
    formContent: '',
    displayContent: ''
  }),
  computed: {
    ...cartModule.mapState(['EDIT_MODE', 'CART']),
    deviceWidth () {
      switch (this.showView) {
        case 'issues':
          return 50
        case 'session':
          return 100
        default:
          return 0
      }
    }
  },
  mounted () {
    if (this.EDIT_MODE.mode) {
      this.selectedIssues = this.CART.businessSupport[this.EDIT_MODE.index].issues
      this.selectedSession = this.CART.businessSupport[this.EDIT_MODE.index].session
      this.issueDescription = this.CART.businessSupport[this.EDIT_MODE.index].issueDescription
      this.isEdit = true
      this.showView = 'issues'
    }
  },
  methods: {
    ...businessITSupportModule.mapActions(['FETCH_BS_ISSUES', 'FETCH_BS_TIME_PRICE']),
    ...cartModule.mapActions(['UPDATE_CART']),
    goBack () {
      switch (this.showView) {
        case 'services':
          this.$router.push('/')
          break
        case 'form':
          this.showView = 'services'
          break
        case 'issues':
          this.showView = 'services'
          break
        case 'session':
          this.showView = 'issues'
          break
        default:
          break
      }
    },
    goNextToForm (selectedServices, serviceDescription) {
      this.selectedServices = selectedServices
      this.serviceDescription = serviceDescription
      this.formContent = ''
      this.displayContent = ''
      if (this.serviceDescription !== '') {
        this.formContent += 'Services Description: ' + this.serviceDescription
        this.displayContent += 'Services Description: ' + this.serviceDescription
      } else {
        this.formContent += 'Services List:\n'
        this.displayContent += '<b>Services:</b>\n'
        this.selectedServices.forEach((element) => {
          this.formContent += element.name + '\n'
          this.displayContent += element.name + '\n'
        })
      }
      this.showView = 'form'
    },
    goToIssues () {
      this.showView = 'issues'
    },
    goNextToSession (selectedIssues, issueDescription) {
      this.selectedIssues = selectedIssues
      this.issueDescription = issueDescription
      this.showView = 'session'
    },
    goNextToBasket (selectedSession) {
      this.selectedSession = selectedSession
      const mainData = {
        type: 'add_bs',
        data: {
          issues: this.selectedIssues,
          session: this.selectedSession,
          issueDescription: this.issueDescription
        }
      }
      this.UPDATE_CART(mainData)
      this.$router.push('/basket')
    }
  }
}
</script>
