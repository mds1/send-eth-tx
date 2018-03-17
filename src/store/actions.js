import web3 from '@ethereum/web3'
import { isValidETHAddress, formatNumberForWeb3 } from '@components/common/functions'

export default {

  // actions for the form
  async setFromAddress(context, address) {
    // use default account, corresponding to accounts[0]
    const accounts = await web3.eth.getAccounts()
    // commit mutation
    context.commit('SET_FROM_ADDRESS', accounts[0])
  },


  setToAddress(context, address) {
    // if address is invalid, set it to null, otherwise use the entered address
    address = isValidETHAddress(address) ? address : null
    // commit mutation
    context.commit('SET_TO_ADDRESS', address)
  },


  setValue(context, value) {
    // take input value in ETH, converts it to Wei, then commits mutation

    // make sure value is valid, otherwise set it to null
    try {
      // format number for Web3 (remove scientific notation, make it a string)
      value = formatNumberForWeb3(value)
      // now convert to Wei with the input value formatted as a string
      value = web3.utils.toWei(value, 'ether')

    } catch (err) {
      console.log(err.message)
      value = null
    }

    // commit mutation
    context.commit('SET_VALUE', value)
  },


  setGasPrice(context, gasPrice) {
    // make sure value is valid, otherwise set it to null
    try {
      // format number for Web3 (remove scientific notation, make it a string)
      gasPrice = formatNumberForWeb3(gasPrice)
      // now convert to Wei with the input value formatted as a string
      gasPrice = web3.utils.toWei(gasPrice, 'gwei')

    } catch (err) {
      console.log(err.message)
      gasPrice = null
    }

    // commit mutation
    context.commit('SET_GAS_PRICE', gasPrice)
  }
}
