const WEB_URL = '/web'

const state = () => ({
})
const getters = {}
const mutations = {}
const actions = {

  async INSERT_ORDER ({ commit }, data) {
    try {
      const resp = await this.$axios.post(`${WEB_URL}/add-order`, data)
      if (resp.status === 200) {
        return resp
      }
      return null
    } catch (error) {
      return error
    }
  },
  async SENT_CUSTOMER_MAIL ({ commit }, data) {
    try {
      const resp = await this.$axios.post('/sent-order-mail', data)
      if (resp.status === 200) {
        return resp
      }
      return null
    } catch (error) {
      return error
    }
  },
  async SENT_ADMIN_MAIL ({ commit }, data) {
    try {
      const resp = await this.$axios.post('/sent-order-mail-admin', data)
      if (resp.status === 200) {
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
