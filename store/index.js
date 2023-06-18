const WEB_URL = '/web'

const state = () => ({
  AUTHENTICATED: false
})
const getters = {}
const mutations = {
  SET_AUTHENTICATED (state, data) {
    state.AUTHENTICATED = data
  }
}
const actions = {
  GET_POST_CODES (ctx) {
    return new Promise((resolve, reject) => {
      this.$axios.get(`${WEB_URL}/show-all-postal-code`)
        .then((response) => {
          if (response.status === 200 && response.data.message === 'Success') {
            resolve(response)
          } else {
            reject(new Error('Something went wrong!'))
          }
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions,
  namespaced: true
}
