const WEB_URL = '/web'

const state = () => ({
})
const getters = {}
const mutations = {}
const actions = {

  async FETCH_T_S_ISSUES ({ commit }) {
    try {
      const resp = await this.$axios.get(`${WEB_URL}/show-all-technical-support-issue`)
      if (resp.status === 200 && resp.data.message === 'Success') {
        return resp
      }
      return null
    } catch (error) {
      return error
    }
  },
  async FETCH_T_S_TIME_PRICE ({ commit }) {
    try {
      const resp = await this.$axios.get(`${WEB_URL}/show-all-technical-support-time-price`)
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
