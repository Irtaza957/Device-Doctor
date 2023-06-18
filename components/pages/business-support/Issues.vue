<template>
  <div>
    <div v-if="!loadingIssues">
      <div v-if="issues">
        <Container>
          <BookingHeader :show-back-button="!isEdit" header-text="Select device issues?" :selection="canGoNext" @goBack="$emit('goBack')" @goNext="goNext" />
          <div class="sm:w-96 w-full mx-auto mt-5">
            <p class="text-center">
              Select multiple if needed
            </p>
          </div>
          <div class="list-wrapper flex flex-col justify-start items-center sm:w-max w-full h-72 overflow-y-scroll mx-auto rounded-lg shadow-md border py-2 px-5 mb-5">
            <div
              v-for="(issue, index) in issues"
              :key="index"
              :class="
                selectedIssuesBoolean[index]
                  ? ' border-logo-red'
                  : ' border-light-gray'
              "
              class="relative border-2 rounded-md sm:w-80 w-full my-2 cursor-pointer p-3"
              @click="selectIssue(index)"
            >
              <div class="flex justify-between items-start">
                <h2 class="Capitalize font-semibold">
                  {{ issue.name }}
                </h2>
              </div>
              <p class="font-light text-xs">
                {{ issue.description }}
              </p>
              <div class="flex justify-between items-center mt-2 text-xs">
                <h2>
                  Recommended Time: <span class="font-medium">{{ issue.average_time }}</span>
                </h2>
              </div>
            </div>
          </div>
          <div class="sm:w-max w-full mx-auto my-4">
            <div class="sm:w-96 w-full">
              <h2 class="text-2xl text-center font-semibold text-dark-gray mt-5 mb-2">
                Or describe your issue here
              </h2>
              <textarea
                v-model="issueDescription"
                rows="3"
                placeholder="Please describe here"
                class="border-light-gray focus:border-light-blue text-dark-gray w-full border outline-none p-3 rounded-lg shadow-md"
              />
            </div>
          </div>
        </Container>
      </div>
      <div v-else>
        <NoResultHubspotForm :flow-name="'Business Support'" @goBack="$emit('goBack')" />
      </div>
    </div>
    <div v-else>
      <Container>
        <BookingHeader :show-back-button="!isEdit" header-text="Select device issues?" :selection="isOneIssueSelected" @goBack="$emit('goBack')" @goNext="$emit('goNext')" />
        <div class="list-wrapper flex flex-col gap-3 justify-start items-center sm:w-max w-full h-72 overflow-y-scroll mx-auto rounded-lg shadow-md border py-2 px-5 my-5">
          <div
            v-for="i in 7"
            :key="i"
          >
            <TextBoxSkeleton />
          </div>
        </div>
      </Container>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const businessITSupportModule = createNamespacedHelpers('businessITSupport')

export default {
  props: {
    isEdit: {
      type: Boolean,
      default: () => false
    }
  },
  data () {
    return {
      loadingIssues: false,
      issues: null,
      selectedIssuesBoolean: false,
      isOneIssueSelected: false,
      issueDescription: ''
    }
  },
  computed: {
    canGoNext () {
      return this.isOneIssueSelected || this.issueDescription.length > 0
    }
  },
  watch: {
    issueDescription (val) {
      if (val.length > 0) {
        this.selectedIssuesBoolean = this.issues.map(() => {
          return false
        })
        this.isOneIssueSelected = false
      }
    }
  },
  async created () {
    await this.fetchIssues()
  },
  methods: {
    ...businessITSupportModule.mapActions(['FETCH_BS_ISSUES']),

    async fetchIssues () {
      try {
        this.loadingIssues = true
        const resp = await this.FETCH_BS_ISSUES()
        if (resp.data.data.length) {
          this.issues = resp.data.data
        } else {
          this.issues = null
        }
        this.selectedIssuesBoolean = this.issues.map(() => {
          return false
        })
        this.loadingIssues = false
      } catch (error) {
        this.issues = null
        this.loadingIssues = false
      }
    },
    selectIssue (index) {
      this.$set(this.selectedIssuesBoolean, index, !this.selectedIssuesBoolean[index])
      // For enable Next btn
      this.isOneIssueSelected = false
      this.selectedIssuesBoolean.forEach((element) => {
        if (element) {
          this.issueDescription = ''
          this.isOneIssueSelected = true
        }
      })
    },
    goNext () {
      const selectedIssues = []
      this.selectedIssuesBoolean.forEach((element, index) => {
        if (element) {
          selectedIssues.push(this.issues[index])
        }
      })
      this.$emit('goNext', selectedIssues, this.issueDescription)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
