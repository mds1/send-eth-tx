<template>

  <div class="row">

    <!-- address field -->
    <div class="col-11">
      <q-field label="Address" :label-width='3' :error="$v.address.$error" :error-label=generateErrorMessage()>
        <q-input v-model='address' v-on:input="updateState" type='text' @input="$v.address.$touch()" spellcheck="false" />
      </q-field>
    </div>

    <!-- identicon -->
    <div class="col">
      <img class='identicon' :src=imageURL v-show=!$v.address.$invalid />
    </div>

  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
import { isValidETHAddress } from '@components/common/functions'
import web3 from '@ethereum/web3'
import * as blockies from '@components/transaction/blockies'

// NEXT STEPS
//    1. Update validator to check for valid ENS also, e.g. isValidETHAddress || isValidENSDomain
//    2. Add template element that shows resolved adress if ENS domain is entered (similar to MEW)

export default {
  data() {
    return {
      // address entered
      address: '',
      // variables for ENS support, from https://github.com/ethereum/meteor-package-elements/blob/master/addressInput.js
      // ENS support added for mainnet only
      ensContractAbi: [{ 'constant': true, 'inputs': [{ 'name': 'node', 'type': 'bytes32' }], 'name': 'resolver', 'outputs': [{ 'name': '', 'type': 'address' }], 'payable': false, 'type': 'function' }, { 'constant': true, 'inputs': [{ 'name': 'node', 'type': 'bytes32' }], 'name': 'owner', 'outputs': [{ 'name': '', 'type': 'address' }], 'payable': false, 'type': 'function' }, { 'constant': false, 'inputs': [{ 'name': 'node', 'type': 'bytes32' }, { 'name': 'label', 'type': 'bytes32' }, { 'name': 'owner', 'type': 'address' }], 'name': 'setSubnodeOwner', 'outputs': [], 'payable': false, 'type': 'function' }, { 'constant': false, 'inputs': [{ 'name': 'node', 'type': 'bytes32' }, { 'name': 'ttl', 'type': 'uint64' }], 'name': 'setTTL', 'outputs': [], 'payable': false, 'type': 'function' }, { 'constant': true, 'inputs': [{ 'name': 'node', 'type': 'bytes32' }], 'name': 'ttl', 'outputs': [{ 'name': '', 'type': 'uint64' }], 'payable': false, 'type': 'function' }, { 'constant': false, 'inputs': [{ 'name': 'node', 'type': 'bytes32' }, { 'name': 'resolver', 'type': 'address' }], 'name': 'setResolver', 'outputs': [], 'payable': false, 'type': 'function' }, { 'constant': false, 'inputs': [{ 'name': 'node', 'type': 'bytes32' }, { 'name': 'owner', 'type': 'address' }], 'name': 'setOwner', 'outputs': [], 'payable': false, 'type': 'function' }, { 'anonymous': false, 'inputs': [{ 'indexed': true, 'name': 'node', 'type': 'bytes32' }, { 'indexed': false, 'name': 'owner', 'type': 'address' }], 'name': 'Transfer', 'type': 'event' }, { 'anonymous': false, 'inputs': [{ 'indexed': true, 'name': 'node', 'type': 'bytes32' }, { 'indexed': true, 'name': 'label', 'type': 'bytes32' }, { 'indexed': false, 'name': 'owner', 'type': 'address' }], 'name': 'NewOwner', 'type': 'event' }, { 'anonymous': false, 'inputs': [{ 'indexed': true, 'name': 'node', 'type': 'bytes32' }, { 'indexed': false, 'name': 'resolver', 'type': 'address' }], 'name': 'NewResolver', 'type': 'event' }, { 'anonymous': false, 'inputs': [{ 'indexed': true, 'name': 'node', 'type': 'bytes32' }, { 'indexed': false, 'name': 'ttl', 'type': 'uint64' }], 'name': 'NewTTL', 'type': 'event' }],
      resolverContractAbi: [{ 'constant': true, 'inputs': [{ 'name': 'interfaceID', 'type': 'bytes4' }], 'name': 'supportsInterface', 'outputs': [{ 'name': '', 'type': 'bool' }], 'payable': false, 'type': 'function' }, { 'constant': true, 'inputs': [{ 'name': 'node', 'type': 'bytes32' }, { 'name': 'contentTypes', 'type': 'uint256' }], 'name': 'ABI', 'outputs': [{ 'name': 'contentType', 'type': 'uint256' }, { 'name': 'data', 'type': 'bytes' }], 'payable': false, 'type': 'function' }, { 'constant': false, 'inputs': [{ 'name': 'node', 'type': 'bytes32' }, { 'name': 'x', 'type': 'bytes32' }, { 'name': 'y', 'type': 'bytes32' }], 'name': 'setPubkey', 'outputs': [], 'payable': false, 'type': 'function' }, { 'constant': true, 'inputs': [{ 'name': 'node', 'type': 'bytes32' }], 'name': 'content', 'outputs': [{ 'name': 'ret', 'type': 'bytes32' }], 'payable': false, 'type': 'function' }, { 'constant': true, 'inputs': [{ 'name': 'node', 'type': 'bytes32' }], 'name': 'addr', 'outputs': [{ 'name': 'ret', 'type': 'address' }], 'payable': false, 'type': 'function' }, { 'constant': false, 'inputs': [{ 'name': 'node', 'type': 'bytes32' }, { 'name': 'contentType', 'type': 'uint256' }, { 'name': 'data', 'type': 'bytes' }], 'name': 'setABI', 'outputs': [], 'payable': false, 'type': 'function' }, { 'constant': true, 'inputs': [{ 'name': 'node', 'type': 'bytes32' }], 'name': 'name', 'outputs': [{ 'name': 'ret', 'type': 'string' }], 'payable': false, 'type': 'function' }, { 'constant': false, 'inputs': [{ 'name': 'node', 'type': 'bytes32' }, { 'name': 'name', 'type': 'string' }], 'name': 'setName', 'outputs': [], 'payable': false, 'type': 'function' }, { 'constant': false, 'inputs': [{ 'name': 'node', 'type': 'bytes32' }, { 'name': 'hash', 'type': 'bytes32' }], 'name': 'setContent', 'outputs': [], 'payable': false, 'type': 'function' }, { 'constant': true, 'inputs': [{ 'name': 'node', 'type': 'bytes32' }], 'name': 'pubkey', 'outputs': [{ 'name': 'x', 'type': 'bytes32' }, { 'name': 'y', 'type': 'bytes32' }], 'payable': false, 'type': 'function' }, { 'constant': false, 'inputs': [{ 'name': 'node', 'type': 'bytes32' }, { 'name': 'addr', 'type': 'address' }], 'name': 'setAddr', 'outputs': [], 'payable': false, 'type': 'function' }, { 'inputs': [{ 'name': 'ensAddr', 'type': 'address' }], 'payable': false, 'type': 'constructor' }, { 'anonymous': false, 'inputs': [{ 'indexed': true, 'name': 'node', 'type': 'bytes32' }, { 'indexed': false, 'name': 'a', 'type': 'address' }], 'name': 'AddrChanged', 'type': 'event' }, { 'anonymous': false, 'inputs': [{ 'indexed': true, 'name': 'node', 'type': 'bytes32' }, { 'indexed': false, 'name': 'hash', 'type': 'bytes32' }], 'name': 'ContentChanged', 'type': 'event' }, { 'anonymous': false, 'inputs': [{ 'indexed': true, 'name': 'node', 'type': 'bytes32' }, { 'indexed': false, 'name': 'name', 'type': 'string' }], 'name': 'NameChanged', 'type': 'event' }, { 'anonymous': false, 'inputs': [{ 'indexed': true, 'name': 'node', 'type': 'bytes32' }, { 'indexed': true, 'name': 'contentType', 'type': 'uint256' }], 'name': 'ABIChanged', 'type': 'event' }, { 'anonymous': false, 'inputs': [{ 'indexed': true, 'name': 'node', 'type': 'bytes32' }, { 'indexed': false, 'name': 'x', 'type': 'bytes32' }, { 'indexed': false, 'name': 'y', 'type': 'bytes32' }], 'name': 'PubkeyChanged', 'type': 'event' }],
      ensAddress: '0x314159265dd8dbb310642f98f50c066173c1259b',
      ensContract: ''
    }
  },

  created() {
    // set ensContract
    this.ensContract = new web3.eth.Contract(this.ensContractAbi, this.ensAddress);
  },

  validations: {
    // validate address entered into input field
    address: {
      required,
      minLength: minLength(42),
      maxLength: maxLength(42),
      isValidETHAddress
    }
  },

  computed: {
    imageURL: function () {
      // only compute URL if we have a valid address
      if (!this.$v.address.$invalid) {
        const toDataURL = blockies[0].blockies['toDataUrl']
        return toDataURL(this.address)
      }
    }

  },

  methods: {

    updateState() {
      // used within ENS callback
      let _this = this

      // filter input
      let address = this.address.replace(/[\s\*\(\)\!\?\#\$\%]+/g, "");

      // check if input is a regular address or ENS domain
      if (isValidETHAddress(address)) {
        // if valid ETH address, update the state
        this.$store.dispatch('setToAddress', address)

      } else if (address.slice(-4) === ".eth") {
        // check for valid ENS address
        // source for ENS integration: https://github.com/ethereum/meteor-package-elements/blob/master/addressInput.js
        // get address from ENS domain
        this.getAddr(address, this.ensContract, function (data) {
          // update address
          address = isValidETHAddress(data) ? data : null
          // update state
          _this.$store.dispatch('setToAddress', address)
        })

      } else {
        // set address to null
        _this.$store.dispatch('setToAddress', null)
      }
    },

    sha3(str, opt) {
      // source: https://github.com/ethereum/meteor-package-elements/blob/master/addressInput.js
      return "0x" + web3.utils.sha3(str, opt).replace("0x", "");
    },

    namehash(name) {
      // source: https://github.com/ethereum/meteor-package-elements/blob/master/addressInput.js
      var node =
        "0x0000000000000000000000000000000000000000000000000000000000000000";
      if (name != "") {
        var labels = name.split(".");
        for (var i = labels.length - 1; i >= 0; i--) {
          node = this.sha3(node + this.sha3(labels[i]).slice(2), { encoding: "hex" });
        }
      }
      return node.toString();
    },

    getAddr(name, ens, callback) {
      // source: https://github.com/ethereum/meteor-package-elements/blob/master/addressInput.js
      var resolverContract = new web3.eth.Contract(this.resolverContractAbi);

      var node = this.namehash(name);
      // get a resolver address for that name
      ens.methods
        .resolver(node)
        .call()
        .then(function (resolverAddress) {
          if (resolverAddress != 0) {
            // if you find one, find the addr of that resolver
            resolverContract.options.address = resolverAddress;
            resolverContract.methods
              .addr(node)
              .call()
              .then(function (result) {
                if (result != 0 && callback) {
                  callback(result);
                }
              });
          } else {
            // NEW: added this else block to ensure address state is set to null if invalid ENS name is entered
            // (this else block was not part of the original source code linked above)
            callback(null)
          }
        });
    },

    getName(address, ens, callback) {
      // source: https://github.com/ethereum/meteor-package-elements/blob/master/addressInput.js
      var resolverContract = new web3.eth.Contract(this.resolverContractAbi);
      var node = this.namehash(
        address.toLowerCase().replace("0x", "") + ".addr.reverse"
      );

      // get a resolver address for that name
      ens.methods.resolver(node).call(function (error, resolverAddress) {
        if (error) {
          console.log("Error from ens getName: ", error);
          return;
        }

        if (resolverAddress != 0) {
          // if you find one, find the name on that resolver
          resolverContract.options.address = resolverAddress;
          resolverContract.methods.name(node, function (error, result) {
            if (!error && result != 0 && callback) {
              callback(result);
            }
          });
        }
      });
    },

    generateErrorMessage() {
      // Figure out which validation requirement failed and notify user
      const params = this.$v.address
      if (params.required === false) {
        return 'Please enter a valid Ethereum address.'

      } else if (params.isValidETHAddress === false || params.maxLength === false) {
        return 'Invalid Ethereum address. Ensure you copy and pasted the address correctly.'

      } else if (params.minLength === false) {
        return 'Address must be 42 characters long. Be sure to include the "0x" prefix.'

      } else {
        return 'Please enter a valid Ethereum address.'
      }
    },

  }

}
</script>

<style lang="stylus" scoped>
.identicon {
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
}
</style>

