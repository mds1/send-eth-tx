export default {
  // form mutations
  SET_FROM_ADDRESS(state, address) {
    state.transactionObject.from = address
  },

  SET_TO_ADDRESS(state, address) {
    state.transactionObject.to = address
  },

  SET_VALUE(state, value) {
    state.transactionObject.value = value
  },

  SET_GAS_PRICE(state, gasPrice) {
    state.transactionObject.gasPrice = gasPrice
  }
}
