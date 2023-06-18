<template>
  <div>
    <Header @toggleModal="toggleModal" />
    <nuxt />
    <!-- Signup Modal -->
    <transition name="fade">
      <template v-if="modal">
        <Modal @toggle="toggleModal" />
      </template>
    </transition>
    <!-- Postcode Modal -->
    <template v-if="!isAuthenticated && !AUTHENTICATED">
      <PostcodeModal />
    </template>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

import Header from '@/components/common/navigation/Header.vue'
import Modal from '~/components/common/modals/Modal.vue'
import PostcodeModal from '~/components/common/modals/PostalCodeModal.vue'

export default {
  components: {
    Header, Modal, PostcodeModal
  },
  data: () => ({
    modal: false,
    isAuthenticated: true
  }),
  computed: {
    ...mapState(['AUTHENTICATED'])
  },
  mounted () {
    const postcode = this.$cookies.get('DD_POSTAL_CODE')
    if (postcode) {
      this.SET_AUTHENTICATED(true)
    }
    this.isAuthenticated = false
  },
  methods: {
    ...mapMutations(['SET_AUTHENTICATED']),
    toggleModal () {
      this.modal = !this.modal
    }
  }
}
</script>

<style lang="scss" scoped>
// This fade effect is used in vuejs transition with name fade
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,.fade-leave-to {
  opacity: 0;
}
</style>
