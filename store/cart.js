const WEB_URL = '/web'

const state = () => ({
  CART: {
    mobileTablet: [],
    technicalSupport: [],
    businessSupport: [],
    totalPrice: 0,
    // Total after discount
    subTotal: 0,
    totalDevices: 0,
    multiDeviceDiscount: 0,
    promocode: null,
    totalTime: null
  },
  PROMO_NEGATIVE: false,
  MULTI_ITEM_DISCOUNT: null,
  EDIT_MODE: {
    mode: false,
    route: '',
    index: -1
  }
})
const getters = {
  GET_CART (state) {
    return state.CART
  },
  GET_EDIT_MODE (state) {
    return state.EDIT_MODE
  }
}
const mutations = {
  /******************************
   * MOBILE, TABLET & CONSOLE
  ******************************/
  ADD_MOBILE_TABLET_CONSOLE_ITEM (state, data) {
    state.CART.mobileTablet.push(data)
  },
  SET_MOBILE_TABLET_CONSOLE_ITEM (state, data) {
    state.CART.mobileTablet[state.EDIT_MODE.index] = data
    state.EDIT_MODE = {
      mode: false,
      route: '',
      index: -1
    }
  },
  REMOVE_MOBILE_TABLET_CONSOLE_ITEM (state, data) {
    const index = state.CART.mobileTablet.indexOf(data)
    if (index > -1) {
      state.CART.mobileTablet.splice(index, 1)
    }
  },
  APPLY_MULTI_ITEM_DISCOUNT (state, data) {
    if (state.MULTI_ITEM_DISCOUNT) {
      // Highest Price and its index
      let highestPrice = 0
      let highestPriceIndex = 0
      data.issues.forEach((element, index) => {
        if (element.price > highestPrice) {
          highestPrice = element.price
          highestPriceIndex = index
        }
      })
      // Add discounted price to all items except highest price item
      data.issues.forEach((element, index) => {
        if (index === highestPriceIndex) {
          data.issues[index].discountedPrice = element.price
        } else {
          data.issues[index].discountedPrice = Math.ceil(element.price - ((state.MULTI_ITEM_DISCOUNT.discount / 100) * element.price))
        }
      })
    }
  },
  /******************************
   * TECHNICAL SUPPORT
  ******************************/
  SET_TECHNICAL_SUPPORT_ITEM (state, data) {
    // Delete this line to allow multiple technical support items
    state.CART.technicalSupport = []
    state.CART.technicalSupport.push(data)
    state.EDIT_MODE = {
      mode: false,
      route: '',
      index: -1
    }
  },
  REMOVE_TECHNICAL_SUPPORT_ITEM (state, data) {
    const index = state.CART.technicalSupport.indexOf(data)
    if (index > -1) {
      state.CART.technicalSupport.splice(index, 1)
    }
  },
  /******************************
   * BUSINESS SUPPORT
  ******************************/
  SET_BUSINESS_SUPPORT (state, data) {
    // Delete this line to allow multiple business support items
    state.CART.businessSupport = []
    state.CART.businessSupport.push(data)
    state.EDIT_MODE = {
      mode: false,
      route: '',
      index: -1
    }
  },
  REMOVE_BUSINESS_SUPPORT (state, data) {
    const index = state.CART.businessSupport.indexOf(data)
    if (index > -1) {
      state.CART.businessSupport.splice(index, 1)
    }
  },
  /******************************
   * PRICE & DISCOUNTS
  ******************************/
  SET_TOTAL_PRICE (state) {
    let total = 0
    // Mobile
    if (state.MULTI_ITEM_DISCOUNT) {
      state.CART.mobileTablet.forEach((device) => {
        device.issues.forEach((issue) => {
          total += issue.discountedPrice
        })
      })
    } else {
      state.CART.mobileTablet.forEach((device) => {
        device.issues.forEach((issue) => {
          total += issue.price
        })
      })
    }
    // Technical Support
    state.CART.technicalSupport.forEach((support) => {
      total += parseInt(support.session.price)
    })
    // Business Support
    state.CART.businessSupport.forEach((support) => {
      total += parseInt(support.session.price)
    })
    state.CART.totalPrice = total
    state.CART.subTotal = total
    if (state.CART.promocode) {
      if (state.CART.promocode.type === 'fixed') {
        state.CART.subTotal -= state.CART.promocode.discount
      } else if (state.CART.promocode.type === 'percent') {
        const discount = (state.CART.promocode.discount / 100) * state.CART.subTotal
        state.CART.subTotal -= Math.ceil(discount)
      }
    }
  },
  APPLY_MULTI_DEVICE_DISCOUNT (state, data) {
    state.CART.multiDeviceDiscount = data
    state.CART.subTotal -= state.CART.multiDeviceDiscount
  },
  SET_TOTAL_TIME (state, data) {
    state.CART.totalTime = data
  },
  SET_MULTI_ITEM_DISCOUNT (state, data) {
    state.MULTI_ITEM_DISCOUNT = data
  },
  SET_PROMOCODE (state, data) {
    let total = 0
    if (data.type === 'fixed') {
      total = data.discount
    } else if (data.type === 'percent') {
      const discount = (data.discount / 100) * state.CART.subTotal
      total -= Math.ceil(discount)
    }
    if (total <= state.CART.subTotal) {
      state.CART.promocode = data
    } else if (!state.CART.promocode) {
      state.PROMO_NEGATIVE = true
    }
  },
  SET_TOTAL_DEVICES (state) {
    state.CART.totalDevices = state.CART.mobileTablet.length + state.CART.technicalSupport.length + state.CART.businessSupport.length
  },
  SET_PROMO_NEGATIVE (state, data) {
    state.PROMO_NEGATIVE = data
  },
  /******************************
   * Cart & Edit Mode
  ******************************/
  SET_EDIT_MODE (state, data) {
    state.EDIT_MODE.mode = data.mode
    state.EDIT_MODE.route = data.route
    state.EDIT_MODE.index = data.index
  },
  EMPTY_CART (state, data) {
    state.CART = {
      mobileTablet: [],
      technicalSupport: [],
      businessSupport: [],
      totalPrice: 0,
      subTotal: 0,
      totalDevices: 0,
      multiDeviceDiscount: 0,
      promocode: null
    }
  }
}
const actions = {
  // Update cart
  async UPDATE_CART ({ commit, dispatch, getters }, data) {
    if (data.type === 'add_mobile') {
      await dispatch('ADD_MOBILE_TABLET_CONSOLE_ITEM', data.data)
    } else if (data.type === 'delete_mobile') {
      dispatch('DELETE_MOBILE_TABLET_CONSOLE_ITEM', data.data)
    } else if (data.type === 'add_ts') {
      dispatch('ADD_TECHNICAL_SUPPORT_ITEM', data.data)
    } else if (data.type === 'delete_ts') {
      dispatch('DELETE_TECHNICAL_SUPPORT_ITEM', data.data)
    } else if (data.type === 'add_bs') {
      dispatch('ADD_BUSINESS_SUPPORT', data.data)
    } else if (data.type === 'delete_bs') {
      dispatch('DELETE_BUSINESS_SUPPORT', data.data)
    }

    // Update total devices
    commit('SET_TOTAL_DEVICES')
    // Set promocode to null if there are no devices
    if (getters.GET_CART.totalDevices < 1) {
      commit('SET_PROMOCODE', null)
    }
    // Set total price and subtotal with promocode applied (if applicable)
    commit('SET_TOTAL_PRICE')
    dispatch('SET_TOTAL_TIME')
    // Get multi device discount and apply on subtotal
    dispatch('APPLY_MULTI_DEVICE_DISCOUNT')
    dispatch('SET_CUSTOMER_CART_IN_DB', { isCompleted: false })
    // Google Analytics Event
    this.$ga.event({
      eventCategory: 'First Device Added',
      eventAction: 'action'
    })
  },
  // Mobile, Tablet & Console
  async ADD_MOBILE_TABLET_CONSOLE_ITEM ({ commit, dispatch, state }, data) {
    await dispatch('FETCH_MULTI_ITEM_DISCOUNT')
    commit('APPLY_MULTI_ITEM_DISCOUNT', data)
    if (state.EDIT_MODE.mode) {
      commit('SET_MOBILE_TABLET_CONSOLE_ITEM', data)
    } else {
      commit('ADD_MOBILE_TABLET_CONSOLE_ITEM', data)
    }
  },
  DELETE_MOBILE_TABLET_CONSOLE_ITEM ({ commit }, data) {
    commit('REMOVE_MOBILE_TABLET_CONSOLE_ITEM', data)
  },
  // Technical Support
  ADD_TECHNICAL_SUPPORT_ITEM ({ commit }, data) {
    commit('SET_TECHNICAL_SUPPORT_ITEM', data)
  },
  DELETE_TECHNICAL_SUPPORT_ITEM ({ commit }, data) {
    commit('REMOVE_TECHNICAL_SUPPORT_ITEM', data)
  },
  // Business Support
  ADD_BUSINESS_SUPPORT ({ commit }, data) {
    commit('SET_BUSINESS_SUPPORT', data)
  },
  DELETE_BUSINESS_SUPPORT ({ commit }, data) {
    commit('REMOVE_BUSINESS_SUPPORT', data)
  },
  // Discounts
  async APPLY_PROMOCODE ({ commit, dispatch }, data) {
    try {
      const resp = await this.$axios.get(`${WEB_URL}/show-promocode-by-code/` + data)
      if (resp.status === 200 && resp.data.message === 'Success' && resp.data.data.length) {
        await commit('SET_PROMOCODE', resp.data.data[0])
        await commit('SET_TOTAL_PRICE')
        dispatch('APPLY_MULTI_DEVICE_DISCOUNT')
        return resp
      }
      return null
    } catch (error) {
      return error
    }
  },
  async APPLY_MULTI_DEVICE_DISCOUNT ({ commit, state }) {
    try {
      const resp = await this.$axios.get(`${WEB_URL}/show-all-multi-device-discount`)
      if (resp.status === 200 && resp.data.message === 'Success') {
        let discount = 0
        let highestDeviceNumber = 0
        let highestDeviceDiscount = 0
        resp.data.data.forEach((element) => {
          if (state.CART.totalDevices === element.no_of_devices) {
            discount = element.discount
          }
          if (element.no_of_devices > highestDeviceNumber) {
            highestDeviceNumber = element.no_of_devices
            highestDeviceDiscount = element.discount
          }
        })
        if (state.CART.totalDevices > highestDeviceNumber) {
          discount = highestDeviceDiscount
        }
        commit('APPLY_MULTI_DEVICE_DISCOUNT', discount)
        return resp
      }
      return null
    } catch (error) {
      return error
    }
  },
  async FETCH_MULTI_ITEM_DISCOUNT ({ commit }) {
    try {
      const resp = await this.$axios.get(`${WEB_URL}/show-latest-multi-item-discount`)
      if (resp.status === 200 && resp.data.message === 'Success') {
        if (resp.data.data) {
          commit('SET_MULTI_ITEM_DISCOUNT', resp.data.data)
          return resp
        }
      }
      return null
    } catch (error) {
      return error
    }
  },
  async FETCH_MULTI_DEVICE_DISCOUNT ({ commit }) {
    try {
      const resp = await this.$axios.get(`${WEB_URL}/show-all-multi-device-discount`)
      if (resp.status === 200 && resp.data.message === 'Success') {
        return resp
      }
      return null
    } catch (error) {
      return error
    }
  },
  async SET_CUSTOMER_CART_IN_DB ({ commit, state }, data) {
    const email = this.$cookies.get('DD_EMAIL')
    if (email) {
      const cart = { ...state.CART, isCompleted: data.isCompleted }
      try {
        const resp = await this.$axios.post(`${WEB_URL}/add-update-customer-cart`, { unique_id: email, details: cart })
        if (resp.status === 200 && resp.data.message === 'Success') {
          return resp
        }
        return null
      } catch (error) {
        return error
      }
    }
  },
  SET_TOTAL_TIME ({ commit, dispatch, state }) {
    let total = 0
    // Mobile
    state.CART.mobileTablet.forEach((device) => {
      device.issues.forEach((issue) => {
        total += CONVERT_TIME_IN_MINUTES(issue.time_required)
      })
    })
    // Technical Support
    state.CART.technicalSupport.forEach((support) => {
      total += CONVERT_TIME_IN_MINUTES(support.session.time)
    })
    // Business Support
    state.CART.businessSupport.forEach((support) => {
      total += CONVERT_TIME_IN_MINUTES(support.session.time)
    })
    commit('SET_TOTAL_TIME', total)
  }
}

function CONVERT_TIME_IN_MINUTES (data) {
  let time = 0
  switch (data) {
    case '30 min':
      time = 30
      break
    case '1 Hour':
      time = 60
      break
    case '1.5 Hour':
      time = 90
      break
    case '2 Hour':
      time = 120
      break
    case '2.5 Hour':
      time = 150
      break
    case '3 Hour':
      time = 180
      break
    case '3.5 Hour':
      time = 210
      break
    case '4 Hour':
      time = 240
      break
    case '15-30 min':
      time = 22
      break
    case '30-60 min':
      time = 45
      break
    case '1-2 Hour':
      time = 90
      break
    case '2-3 Hour':
      time = 150
      break
    case '1-3 Hour':
      time = 120
      break
    case '2-4 Hour':
      time = 180
      break
    case '3-4 Hour':
      time = 210
      break
    default:
      break
  }
  return time
}

export default {
  state,
  getters,
  mutations,
  actions,
  namespaced: true
}
