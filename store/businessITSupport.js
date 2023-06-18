const WEB_URL = '/web'

const state = () => ({
})
const getters = {
}
const mutations = {
}
const actions = {
  async FETCH_BS_SERVICES ({ commit }) {
    try {
      const resp = await this.$axios.get(`${WEB_URL}/show-all-business-support-service`)
      if (resp.status === 200 && resp.data.message === 'Success') {
        return resp
      }
      return null
    } catch (error) {
      return error
    }
  },
  async FETCH_BS_ISSUES ({ commit }) {
    try {
      const resp = await this.$axios.get(`${WEB_URL}/show-all-business-support-issue`)
      if (resp.status === 200 && resp.data.message === 'Success') {
        return resp
      }
      return null
    } catch (error) {
      return error
    }
  },
  async FETCH_BS_TIME_PRICE ({ commit }) {
    try {
      const resp = await this.$axios.get(`${WEB_URL}/show-all-business-support-time-price`)
      if (resp.status === 200 && resp.data.message === 'Success') {
        return resp
      }
      return null
    } catch (error) {
      return error
    }
  }
}
export default {
  state,
  getters,
  mutations,
  actions,
  namespaced: true
}
