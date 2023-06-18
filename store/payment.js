const state = () => ({
  PAYMENT_DETAILS: {
    advance_amount: 19,
    payment_type: 'Stripe',
    paid_full: true
  }
})
const getters = {
  GET_PAYMENT_DETAILS (state) {
    return state.PAYMENT_DETAILS
  }
}
const mutations = {
  SET_PAYMENT_TYPE (state, data) {
    state.PAYMENT_DETAILS.payment_type = data
  },
  SET_PAID_FULL (state, data) {
    state.PAYMENT_DETAILS.paid_full = data
  },
  RESET_PAYMENT_DETAILS (state, data) {
    state.PAYMENT_DETAILS = {
      advance_amount: 19,
      payment_type: 'Stripe',
      paid_full: true
    }
  }
}
const actions = {
  async KLARNA_CREATE_ORDER ({ commit }, data) {
    try {
      const resp = await this.$axios.post('/charge-user-through-klarna', data)
      return resp
    } catch (error) {
      return null
    }
  },
  async KLARNA_GET_ORDER ({ commit }, data) {
    try {
      const resp = await this.$axios.get('/get-order-klarna/' + data.order_id)
      return resp
    } catch (error) {
      return null
    }
  },
  async CHARGE_STRIPE ({ commit }, data) {
    try {
      const resp = await this.$axios.post('/charge-user-through-stripe', data)
      return resp
    } catch (error) {
      return null
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
