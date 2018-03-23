<template>
  <div>
    <div class="row">

      <!-- address input field -->
      <div class="col-11">
        <q-field label="Address" :label-width='3' :error="$v.address.$error" :error-label=generateErrorMessage()>
          <q-input v-model='address' v-on:input="updateState" type='text' @input="$v.address.$touch()" spellcheck="false" />
        </q-field>
      </div>

      <!-- blockies identicon -->
      <div class="col">
        <img class='identicon' :src=imageURL v-show=!$v.address.$invalid />
      </div>

    </div>

    <!-- if ENS entered, display resolved address underneath the field -->
    <div class="ens-resolved">
      <p v-show='!$v.address.$invalid && this.address.slice(-4) ===".eth"'>Entered address resolves to: {{ this.$store.state.transactionObject.to }}</p>
    </div>

  </div>

</template>

<script>
import { mapActions } from 'vuex'
import web3 from '@ethereum/web3'
import * as blockies from '@components/transaction/blockies'
// validators
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
import { isValidETHAddress, isValidENSDomain, getAddr, currentNetwork } from '@components/common/functions'
// ENS variable imports (ENS support for mainnet only)
import { ensContract } from '@components/common/functions'

export default {
  data() {
    return {
      // address entered
      address: '',
      // default to transparent image
      transparentBase64Img: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
      imageURL: this.transparentBase64Img
    }
  },

  validations: {
    // validate address entered into input field
    address: {
      required,
      async isValidAddress(address) {
        // check for empty address
        if (address === null || address === '' || typeof address === 'undefined') {
          return false
        }
        // check for regular address
        if (isValidETHAddress(address)) {
          return true
        }
        // async check for ENS name (ENS support for mainnet only)
        const network = await currentNetwork()
        if (network === 'Main') {
          return await isValidENSDomain(address, ensContract)
        }
        return false
      }
    }
  }, // end validations

  methods: {

    updateState() {
      // used within ENS callback
      let _this = this
      // used to generate blockies image
      const toDataURL = blockies[0].blockies['toDataUrl']
      // filter input
      var address = this.address.replace(/[\s\*\(\)\!\?\#\$\%]+/g, "");

      // check if input is a regular address or ENS domain
      if (isValidETHAddress(address)) {
        // entered address is valid
        // update blockies image
        this.imageURL = toDataURL(address)
        // update the state
        this.$store.dispatch('setToAddress', address)

      } else if (address.slice(-4) === ".eth") {
        // check for valid ENS address
        // source for ENS integration: https://github.com/ethereum/meteor-package-elements/blob/master/addressInput.js
        getAddr(address, ensContract, function (data) {
          // update local address variable
          address = isValidETHAddress(data) ? data : null
          // update blockies image (if invalid address, use transparent image)
          _this.imageURL = isValidETHAddress(address) ? toDataURL(address) : _this.transparentBase64Img
          // update state
          _this.$store.dispatch('setToAddress', address)
        })

      } else {
        // set address to null
        this.$store.dispatch('setToAddress', null)
      }
    }, // end UpdateSate

    generateErrorMessage() {
      // use this to figure out which validation requirement failed and notify user
      const params = this.$v.address
      if (params.required === false) {
        return 'Please enter a valid Ethereum address.'
      } else {
        return 'Please enter a valid Ethereum address.'
      }
    }, // end generateErrorMessage

  } // end methods

}
</script>

<style lang="stylus" scoped>
.identicon {
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
}

.ens-resolved {
  font-size: 0.9rem;
  text-align: left;
}
</style>

