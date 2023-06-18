const WEB_URL = '/web'

const state = () => ({
})
const getters = {}
const mutations = {}
const actions = {
  async FETCH_CATEGORIES ({ commit }) {
    try {
      const resp = await this.$axios.get(`${WEB_URL}/show-all-category`)
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
