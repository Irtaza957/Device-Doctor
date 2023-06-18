const WEB_URL = '/web'

const state = () => ({
})
const getters = {
}
const mutations = {
}
const actions = {
  async FETCH_M_CATEGORY ({ commit }) {
    try {
      const resp = await this.$axios.get(`${WEB_URL}/show-all-mobile-category`)
      if (resp.status === 200 && resp.data.message === 'Success') {
        return resp
      }
      return null
    } catch (error) {
      return error
    }
  },
  async FETCH_M_BRANDS ({ commit }, id) {
    try {
      const resp = await this.$axios.get(`${WEB_URL}/show-mobile-brand-by-category/` + id)
      if (resp.status === 200 && resp.data.message === 'Success') {
        return resp
      }
      return null
    } catch (error) {
      return error
    }
  },
  async FETCH_M_MODELS ({ commit }, id) {
    try {
      const resp = await this.$axios.get(`${WEB_URL}/show-mobile-model-by-brand/` + id)
      if (resp.status === 200 && resp.data.message === 'Success') {
        return resp
      }
      return null
    } catch (error) {
      return error
    }
  },
  async FETCH_M_COLORS ({ commit }, id) {
    try {
      const resp = await this.$axios.get(`${WEB_URL}/show-mobile-colours-by-model/` + id)
      if (resp.status === 200 && resp.data.message === 'Success') {
        return resp
      }
      return null
    } catch (error) {
      return error
    }
  },
  async FETCH_M_ISSUES ({ commit }, id) {
    try {
      const resp = await this.$axios.get(`${WEB_URL}/show-mobile-parts-by-model/` + id)
      if (resp.status === 200 && resp.data.message === 'Success') {
        return resp
      }
      return null
    } catch (error) {
      return error
    }
  },
  async FETCH_ALL_ISSUES ({ commit }) {
    try {
      const resp = await this.$axios.get(`${WEB_URL}/show-all-mobile-part`)
      if (resp.status === 200 && resp.data.message === 'Success') {
        return resp
      }
      return null
    } catch (error) {
      return error
    }
  },
  async FETCH_ISSUES_BY_MODEL_AND_COLOR ({ commit }, data) {
    try {
      const resp = await this.$axios.get(`${WEB_URL}/show-mobile-parts-by-model-and-color/` + data.model_id + '/' + data.color_id)
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
