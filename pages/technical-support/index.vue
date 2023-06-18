<template>
  <div class="relative overflow-hidden">
    <Container>
      <!-- Progress Bar -->
      <ProgressBar :device-width="deviceWidth" :device-completed="false" />
      <!-- Issues -->
      <template v-if="showView === 'issues'">
        <Issues :is-edit="isEdit" @goBack="goBack" @goNext="goNextToSessionOrDescription" />
      </template>
      <!-- Issue Description -->
      <template v-if="showView === 'selectedIssuesDescription'">
        <SelectedIssuesDescription @goBack="goBack" @goNext="goNextToSession" />
      </template>
      <!-- Session -->
      <template v-if="showView === 'sessions'">
        <Session :selected-issues="selectedIssues" @goBack="goBack" @goNext="goToBasket" />
      </template>
    </container>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import Issues from '~/components/pages/technical-support/Issues.vue'
import SelectedIssuesDescription from '~/components/pages/technical-support/SelectedIssuesDescription.vue'
import Session from '~/components/pages/technical-support/Session.vue'
import ProgressBar from '~/components/common/ProgressBar.vue'

const cartModule = createNamespacedHelpers('cart')
export default {

  components: {
    Issues,
    SelectedIssuesDescription,
    Session,
    ProgressBar
  },
  data: () => ({
    showView: 'issues',
    // Issues
    selectedIssues: null,
    issueDescription: '',
    selectedIssuesDescription: '',
    isEdit: false,
    // Session
    selectedSession: null
  }),
  computed: {
    ...cartModule.mapState(['EDIT_MODE', 'CART']),
    deviceWidth () {
      switch (this.showView) {
        case 'issues':
          return 50
        case 'selectedIssuesDescription':
          return 75
        case 'sessions':
          return 100
        default:
          return 0
      }
    }
  },
  mounted () {
    if (this.EDIT_MODE.mode) {
      this.selectedIssues = this.CART.technicalSupport[this.EDIT_MODE.index].issues
      this.selectedSession = this.CART.technicalSupport[this.EDIT_MODE.index].session
      this.issueDescription = this.CART.technicalSupport[this.EDIT_MODE.index].issueDescription
      this.isEdit = true
      this.showView = 'issues'
    }
  },
  methods: {
    ...cartModule.mapActions(['UPDATE_CART']),
    goBack () {
      switch (this.showView) {
        case 'issues':
          this.$router.push('/')
          break
        case 'selectedIssuesDescription':
          this.showView = 'issues'
          break
        case 'sessions':
          if (this.issueDescription === '') {
            this.showView = 'selectedIssuesDescription'
          } else {
            this.showView = 'issues'
          }
          break
        default:
          break
      }
    },
    goNextToSessionOrDescription (selectedIssues, issueDescription) {
      this.selectedIssues = selectedIssues
      this.issueDescription = issueDescription
      if (this.issueDescription === '') {
        this.showView = 'selectedIssuesDescription'
      } else {
        this.showView = 'sessions'
      }
    },
    goNextToSession (val) {
      this.selectedIssuesDescription = val
      this.showView = 'sessions'
    },
    goToBasket (selectedSession) {
      this.selectedSession = selectedSession
      const data = {
        issues: this.selectedIssues,
        session: this.selectedSession,
        issueDescription: this.issueDescription,
        selectedIssuesDescription: this.selectedIssuesDescription
      }
      const mainData = {
        type: 'add_ts',
        data
      }
      this.UPDATE_CART(mainData)
      this.$router.push('/basket')
    }
  }
}
</script>
