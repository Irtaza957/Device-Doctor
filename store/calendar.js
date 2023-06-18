const WEB_URL = '/web'

const state = () => ({
})
const getters = {}
const mutations = {}
const actions = {

  async INSERT_EVENT ({ commit }, data) {
    try {
      const resp = await this.$axios.post('/store-google-calendar-event', data)
      if (resp.status === 200) {
        return resp
      }
      return null
    } catch (error) {
      return error
    }
  },

  async FETCH_EVENTS ({ commit }) {
    try {
      const resp = await this.$axios.get('/show-all-google-calendar')
      if (resp.status === 200) {
        return resp
      }
      return null
    } catch (error) {
      return error
    }
  },

  async FETCH_EVENTS_BY_DATE ({ commit }, data) {
    try {
      const resp = await this.$axios.post('/show-by-date-google-calendar', data)
      if (resp.status === 200) {
        return resp
      }
      return null
    } catch (error) {
      return error
    }
  },

  async SHOW_ALL_CALENDER ({ commit }) {
    try {
      const resp = await this.$axios.get(`${WEB_URL}/show-all-calender`)
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
