<template>
  <Container>
    <!-- Brands -->
    <template v-if="showView === 'brands'">
      <Brands @goBack="goBack" @goNext="goNextToType" />
    </template>

    <!-- Types -->
    <template v-else-if="showView === 'types'">
      <Types :type-category="typeCategory" @goBack="goBack" @goNext="goNextToIssues" />
    </template>

    <!-- Issues -->
    <template v-else-if="showView === 'issues'">
      <Issues :selected-type-i-d="selectedType.id" @goBack="goBack" @goNext="goNextToForm" />
    </template>

    <!-- Form -->
    <template v-else-if="showView === 'form'">
      <HubspotForm :form-content="formContent" :display-content="displayContent" :flow-name="'Mac, Laptop & PC'" @goBack="goBack" />
    </template>
  </Container>
</template>

<script>
import Brands from '@/components/pages/mac-laptop-pc/Brands.vue'
import Types from '@/components/pages/mac-laptop-pc/Types.vue'
import Issues from '@/components/pages/mac-laptop-pc/Issues.vue'
import HubspotForm from '~/components/common/hubspot/Form.vue'
export default {
  components: {
    Brands,
    Types,
    Issues,
    HubspotForm
  },
  data: () => ({
    showView: 'brands',
    // apple or other
    typeCategory: null,
    // Brand
    selectedBrand: null,
    // Type
    selectedType: null,
    model_number: '',
    // Issues
    selectedIssues: [],
    issueDescription: '',
    // Form
    formContent: '',
    displayContent: ''
  }),
  methods: {
    goBack () {
      switch (this.showView) {
        case 'brands':
          this.$router.push('/')
          break
        case 'types':
          this.showView = 'brands'
          break
        case 'issues':
          this.showView = 'types'
          break
        case 'form':
          this.showView = 'issues'
          break
        default:
          break
      }
    },
    goNextToType (type, selectedBrand) {
      this.typeCategory = type
      this.selectedBrand = selectedBrand
      this.showView = 'types'
    },
    goNextToIssues (selectedType, modelNumber) {
      this.selectedType = selectedType
      this.model_number = modelNumber
      this.showView = 'issues'
    },
    goNextToForm (selectedIssues, issueDescription) {
      this.selectedIssues = selectedIssues
      this.issueDescription = issueDescription
      this.formContent = 'Selected Brand: ' + this.selectedBrand.name + '\nSelected Type: ' + this.selectedType.name + '\n'
      this.displayContent = 'Selected Brand: ' + this.selectedBrand.name + '\nSelected Type: ' + this.selectedType.name + '\n'
      if (this.model_number) {
        this.formContent += 'Model Number: ' + this.model_number + '\n'
        this.displayContent += 'Model Number: ' + this.model_number + '\n'
      }
      if (this.issueDescription !== '') {
        this.formContent += 'Issue Description: ' + this.issueDescription
        this.displayContent += 'Issue Description: ' + this.issueDescription
      } else {
        this.formContent += 'Issue List:\n'
        this.displayContent += 'Issue List:\n<ul class=\'ml-4 list-disc\'>'
        this.selectedIssues.forEach((element) => {
          this.formContent += element.laptop_issues.name + '\n'
          this.displayContent += '<li>' + element.laptop_issues.name + '</li>\n'
        })
        this.displayContent += '</ul>\n'
      }
      this.showView = 'form'
    }
  }
}
</script>
