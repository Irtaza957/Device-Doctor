<template>
  <div class="relative overflow-hidden">
    <Container>
      <template v-if="showView !== 'mobileform'">
        <ProgressBar :device-width="deviceWidth" :device-completed="false" />
      </template>

      <!-- SubCategories -->
      <template v-if="showView === 'subcategory'">
        <SubCategories @goBack="goBack" @goNext="goNextToBrands" />
      </template>

      <!-- Brands -->
      <template v-else-if="showView === 'brands'">
        <Brands :selected-category="selectedCategory" @goBack="goBack" @goNext="goNextToModels" />
      </template>

      <!-- Models -->
      <template v-else-if="showView === 'models'">
        <Models
          :selected-category="selectedCategory"
          :selected-brand="selectedBrand"
          @goBack="goBack"
          @goNext="goNextToColor"
        />
      </template>

      <!-- Colors -->
      <template v-else-if="showView === 'colors'">
        <Colors
          :selected-category="selectedCategory"
          :selected-brand="selectedBrand"
          :selected-model="selectedModel"
          @goBack="goBack"
          @goNext="goNextToIssues"
        />
      </template>

      <!-- Issues -->
      <template v-else-if="showView === 'issues'">
        <Issues
          :selected-category="selectedCategory"
          :selected-brand="selectedBrand"
          :selected-model="selectedModel"
          :selected-color="selectedColor"
          :is-edit="isEdit"
          @goBack="goBack"
          @goNext="goNextToUpsaleOrBasket"
        />
      </template>

      <!-- Mobile Form -->
      <template v-else-if="showView === 'mobileform'">
        <HubspotForm :form-content="formContent" :display-content="displayContent" :flow-name="'Mobile, Tablet & Console'" @goBack="goBack" />
      </template>

      <!-- Upsale -->
      <template v-else-if="showView === 'upsale'">
        <Upsale :selected-issues="selectedIssues" :pending-issues="pendingIssues" @goBack="goBack" @goNext="goNextToBasketWithUpsale" />
      </template>
    </Container>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import SubCategories from '@/components/pages/mobile-and-tablets/SubCategories.vue'
import Brands from '@/components/pages/mobile-and-tablets/Brands.vue'
import Models from '@/components/pages/mobile-and-tablets/Models.vue'
import Issues from '@/components/pages/mobile-and-tablets/Issues.vue'
import Colors from '@/components/pages/mobile-and-tablets/Colors.vue'
import Upsale from '~/components/pages/mobile-and-tablets/Upsale.vue'
import HubspotForm from '~/components/common/hubspot/Form.vue'
import ProgressBar from '~/components/common/ProgressBar.vue'

const cartModule = createNamespacedHelpers('cart')

export default {
  components: {
    SubCategories,
    Brands,
    Models,
    Issues,
    Colors,
    Upsale,
    HubspotForm,
    ProgressBar
  },
  data: () => ({
    showView: 'subcategory',
    // subcategory
    selectedCategory: null,
    // Brands
    selectedBrand: null,
    // Models
    selectedModel: null,
    // Parts
    selectedIssues: [],
    pendingIssues: [],
    isUpsale: false,
    issueDescription: '',
    // Colors
    selectedColor: null,
    // Form
    formContent: '',
    displayContent: '',
    // Edit Mode
    isEdit: false
  }),
  computed: {
    ...cartModule.mapGetters(['GET_CART', 'GET_EDIT_MODE']),
    deviceWidth () {
      switch (this.showView) {
        case 'subcategory':
          return 20
        case 'brands':
          return 40
        case 'models':
          return 60
        case 'issues':
          return 80
        case 'upsale':
          return 90
        case 'colors':
          return 100
        default:
          return 0
      }
    }
  },
  mounted () {
    if (this.GET_EDIT_MODE.mode) {
      this.selectedCategory = this.GET_CART.mobileTablet[this.GET_EDIT_MODE.index].subcategory
      this.selectedBrand = this.GET_CART.mobileTablet[this.GET_EDIT_MODE.index].brand
      this.selectedModel = this.GET_CART.mobileTablet[this.GET_EDIT_MODE.index].model
      this.selectedColor = this.GET_CART.mobileTablet[this.GET_EDIT_MODE.index].color
      this.isEdit = true
      this.showView = 'issues'
    }
  },
  methods: {
    ...cartModule.mapActions(['UPDATE_CART']),

    goBack () {
      switch (this.showView) {
        case 'subcategory':
          this.$router.push('/')
          break
        case 'brands':
          this.showView = 'subcategory'
          break
        case 'models':
          this.showView = 'brands'
          break
        case 'colors':
          this.showView = 'models'
          break
        case 'issues':
          this.showView = 'colors'
          break
        case 'mobileform':
          this.showView = 'issues'
          break
        case 'upsale':
          this.showView = 'issues'
          break
        default:
          break
      }
    },
    goNextToBrands (selectedCategory) {
      this.selectedCategory = selectedCategory
      this.showView = 'brands'
    },
    goNextToModels (selectedBrand) {
      this.selectedBrand = selectedBrand
      this.showView = 'models'
    },
    goNextToColor (selectedModel) {
      this.selectedModel = selectedModel
      this.showView = 'colors'
    },
    goNextToIssues (selectedColor) {
      this.selectedColor = selectedColor
      this.showView = 'issues'
    },
    async goNextToUpsaleOrBasket (selectedIssues, pendingIssues, issueDescription) {
      this.issueDescription = issueDescription
      if (issueDescription !== '') {
        this.setFormContent(issueDescription)
        this.showView = 'mobileform'
        return
      }
      // Check for upsale
      this.isUpsale = false
      this.pendingIssues = []
      pendingIssues.forEach((element) => {
        if (element.is_upsale === '1') {
          this.isUpsale = true
          this.pendingIssues.push(element)
        }
      })
      this.selectedIssues = selectedIssues

      if (this.isUpsale) {
        this.showView = 'upsale'
      } else {
        await this.addToCart()
        this.$router.push('/basket')
      }
    },
    setFormContent (issueDescription) {
      // Hubspot Content
      this.formContent = 'Category: ' + this.selectedCategory.name
      this.formContent += '\nBrand: ' + this.selectedBrand.name
      this.formContent += '\nModel: ' + this.selectedModel.name
      this.formContent += '\nColor: ' + this.selectedColor.name
      this.formContent += '\nIssue Description: ' + issueDescription
      if (this.GET_CART.mobileTablet.length) {
        this.formContent += '\n\nIssues in the Basket:'
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
      // Display Content
      this.displayContent = '\nCategory: ' + this.selectedCategory.name
      this.displayContent += '\nBrand: ' + this.selectedBrand.name
      this.displayContent += '\nModel: ' + this.selectedModel.name
      this.displayContent += '\nColor: ' + this.selectedColor.name
      this.displayContent += '\nIssue Description: ' + issueDescription
      if (this.GET_CART.mobileTablet.length) {
        this.displayContent += '\n<b>Items in the Basket:</b>'
        this.GET_CART.mobileTablet.forEach((element, index) => {
          this.displayContent += `\nItem # ${index + 1}:\n`
          this.displayContent += 'Category: ' + element.subcategory.name
          this.displayContent += ', Brand: ' + element.brand.name
          this.displayContent += ', Model: ' + element.model.name
          this.displayContent += ', Color: ' + element.color.name
          this.displayContent += '\nParts List:'
          element.issues.forEach((item) => {
            this.displayContent += '\n\t' + item.name
          })
        })
      }
    },
    async goNextToBasketWithUpsale (selectedIssues) {
      selectedIssues.forEach((element) => {
        this.selectedIssues.push(element)
      })
      await this.addToCart()
      this.$router.push('/basket')
    },
    async addToCart () {
      const mainData = {
        type: 'add_mobile',
        data: {
          subcategory: this.selectedCategory,
          brand: this.selectedBrand,
          model: this.selectedModel,
          issues: this.selectedIssues,
          color: this.selectedColor
        }
      }
      await this.UPDATE_CART(mainData)
    }
  }
}
</script>
