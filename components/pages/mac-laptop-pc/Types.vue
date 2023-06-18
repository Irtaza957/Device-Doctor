<template>
  <div>
    <div v-if="!loadingTypes">
      <div v-if="laptopTypes">
        <Container>
          <div class="relative">
            <BookingHeader header-text="Please select type" :is-header-text-uppercase="false" :selection="selectedType.id !== null" @goBack="$emit('goBack')" @goNext="$emit('goNext', selectedType, model_number)" />
            <div class="grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-8 py-8 xl:px-16">
              <div
                v-for="(type, index) in laptopTypes"
                :key="index"
                :class="selectedType.name === type.name ? 'shadow-selected-card border-logo-red' : 'shadow-none border-light-gray'"
                class="relative cursor-pointer border-2 hover:border-logo-red transition ease-linear duration-150 rounded-lg"
                @click="selectType(type)"
              >
                <div>
                  <div class="flex justify-center items-center p-3">
                    <img :src="type.image" class="w-16 h-16 md:w-36 md:h-36">
                  </div>
                  <div class="text-sm md:text-lg text-center p-1 pb-7">
                    {{ type.name }}
                  </div>
                  <div
                    v-if="selectedType.name === type.name"
                    class="absolute h-12 w-12 flex justify-center items-center rounded-full bg-black text-white left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2"
                  >
                    <font-awesome-icon :icon="['fas', 'check']" class="text-lg" />
                  </div>
                </div>
              </div>
            </div>
            <div v-if="selectedType" class="w-full sm:w-96 border mx-auto px-5 flex justify-between items-center mb-8">
              <div>
                <input v-model="model_number" type="text" name="model" class="outline-none py-4 text xs" placeholder="Model number (optional)">
              </div>
              <div v-if="selectedType.popup_description" class="pop-up-parent relative group hover:border-logo-red  h-7 w-7 border-2 rounded-full flex justify-center items-center">
                <font-awesome-icon :icon="['fas', 'info' ]" class="text-xs text-gray-400 group-hover:text-logo-red " />
                <div class="pop-up-child absolute bottom-full -right-2 pb-3">
                  <div class="relative bg-white border shadow text-xs font-light px-3 py-4 ">
                    <img v-if="selectedType.popup_image" :src="selectedType.popup_image">
                    {{ selectedType.popup_description }}
                    <div class="absolute bottom-0 right-3 transform translate-y-1/2 rotate-45 bg-white border-r-2 border-b-2 h-3 w-3 -mb-px" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
      <div v-else>
        <NoResultHubspotForm :flow-name="'Mac, Laptop & PC'" @goBack="$emit('goBack')" />
      </div>
    </div>
    <div v-else>
      <Container>
        <BookingHeader header-text="Please select type" :is-header-text-uppercase="false" :selection="selectedType.id !== null" @goBack="$emit('goBack')" @goNext="$emit('goNextToIssues',selectedType)" />
        <div class="grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-8 py-8 xl:px-16">
          <div
            v-for="i in 12"
            :key="i"
          >
            <ImageBoxSkeleton />
          </div>
        </div>
      </Container>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const laptopModule = createNamespacedHelpers('laptop')

export default {
  props: {
    typeCategory: {
      type: String,
      default: () => ''
    }
  },
  data () {
    return {
      loadingTypes: false,
      laptopTypes: null,
      selectedType: {
        id: null,
        name: ''
      },
      model_number: ''
    }
  },
  async created () {
    await this.getLaptopTypes()
  },
  methods: {
    ...laptopModule.mapActions(['FETCH_LAPTOP_TYPES']),
    async getLaptopTypes () {
      try {
        this.loadingTypes = true
        const resp = await this.FETCH_LAPTOP_TYPES()
        if (resp.data.data.length) {
          this.laptopTypes = resp.data.data
          this.laptopTypes = this.laptopTypes.filter((item) => {
            return item.type === this.typeCategory
          })
        } else {
          this.laptopTypes = null
        }
        this.loadingTypes = false
      } catch (error) {
        this.laptopTypes = null
        this.loadingTypes = false
      }
    },
    selectType (obj) {
      this.selectedType = obj
    }
  }
}
</script>

<style lang="scss" scoped>
.pop-up-parent {
  .pop-up-child {
    display: none;
    width: 19rem;
  }
  &:hover .pop-up-child {
    display: block;
    animation: popup .2s ease-in-out;
  }
}

@keyframes popup {
  0%{
    opacity: 0;
    transform: scale(.8) ;
  }
  80%{
    opacity: 1;
    transform: scale(1.03) ;
  }
  100%{
    opacity: 1;
    transform: scale(1) ;
  }
}
</style>
