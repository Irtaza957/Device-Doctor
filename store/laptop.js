const WEB_URL = '/web'

const state = () => ({
})
const getters = {}
const mutations = {}
const actions = {

  async FETCH_LAPTOP_BRANDS ({ commit }) {
    try {
      const resp = await this.$axios.get(`${WEB_URL}/show-all-laptop-brand`)
      if (resp.status === 200 && resp.data.message === 'Success') {
        return resp
      }
      return null
    } catch (error) {
      return error
    }
  },

  async FETCH_LAPTOP_TYPES ({ commit }) {
    try {
      const resp = await this.$axios.get(`${WEB_URL}/show-all-laptop-type`)
      if (resp.status === 200 && resp.data.message === 'Success') {
        return resp
      }
      return null
    } catch (error) {
      return error
    }
  },

  async FETCH_LAPTOP_ISSUES ({ commit }, data) {
    try {
      const resp = await this.$axios.get(`${WEB_URL}/show-laptop-issue-with-respect-type/${data.type_id}`)
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
