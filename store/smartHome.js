const WEB_URL = '/web'

const state = () => ({
})
const getters = {}
const mutations = {}
const actions = {

  async FETCH_SMART_HOME_PARTS ({ commit }) {
    try {
      const resp = await this.$axios.get(`${WEB_URL}/show-all-home-appliance`)
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
