
const infuraKey = '3758b6e35f854792a10d4d88d4f9af86'
const provider = `wss://rinkeby.infura.io/ws/v3/${infuraKey}`

const util = require('util')
const Web3 = require('web3');
// const provider = 'wss://mainnet-ws.thundercore.com'
var web3 = new Web3(provider);
const BigNumber = require('bignumber.js');

// const tippingContract = require('./tippingContract')
const revenueSharingContract = require('./revenueSharingContractInfo')
// const simpleStorage = require('./simpleStorage')


const prettyPrint = (o) => {
  return util.inspect(o, { showHidden: false, depth: null, colors: true })
}

// var contract = new web3.eth.Contract(tippingContract.ABI, tippingContract.address)
var contract = new web3.eth.Contract(revenueSharingContract.ABI, revenueSharingContract.address)
// var contract = new web3.eth.Contract(simpleStorage.ABI, simpleStorage.address)
// console.log(contract)

const tempFunction = async () => {
  // var getValue = await contract.methods.get().call()
  var getValue = await contract.methods.getTotalPercentage().call()
  var pickPointer = await contract.methods.pickPointer(20).call()
  
  console.log(getValue)
  console.log(pickPointer)

  // let number = new BigNumber(123);
  // var setValue = await contract.methods.set(number).call()
  // console.log(setValue)
}

tempFunction()

let listenOnce = () => {
  // Create a connection to Thundercore mainet.

  // var subscription = contract.events.Tip({}, (error, result) => {
  var subscription = contract.methods.get().call({}, (error, result) => {
    if (error) {
      sails.log.error(error)
      sails.log.info('Reconnecting to Thundercore mainnet.')
      // TODO: Improve reconnection handling by using something like web3-providers-ws.
      setTimeout(() => {
        // Re-instantiating web3 and contract is needed in case the connection is dropped.
        web3 = new Web3('wss://mainnet-ws.thundercore.com');
        contract = new web3.eth.Contract(tippingContract.ABI, tippingContract.address)
        _listen()
      }, 5000);
    }
  })
    .on('data', async (log) => {

      var senderAddress = log.returnValues.from
      var receiverAddress = log.returnValues.to
      var value = log.returnValues.value
      // Convert from big number to a normal one (eg: from 1000000000000000000 to 1)
      value = web3.utils.fromWei(value, 'ether')
      var transactionHash = log.transactionHash
      const status = false

      var newTip = {
        transactionHash: transactionHash,
        value: value,
        sender: {
          walletAddress: senderAddress
        },
        receiver: {
          walletAddress: receiverAddress
        },
        verification: {
          status: status
        }
      }

      sails.log.debug(`Tip from '${senderAddress}' to '${receiverAddress}' added.`);

      // var newTipRecord = await Tips.create(newTip).fetch();
      var newTipRecord = await Tips.findOrCreate({ transactionHash: transactionHash }, newTip);
      if (newTipRecord) {
        sails.log.info(`Tip from '${senderAddress}' to '${receiverAddress}' added.`);
      } else {
        sails.log.error(`Failed to add tip from '${senderAddress}' to '${receiverAddress}`)
      }
    })

  return subscription
}

const _listen = async () => {
  let tips = listenOnce();
  sails.log.info('Connected to Thundercore mainnet.')

  // web3 subscription times out at 60 secs. Close and reopen at 50 secs.
  setInterval(() => {
    // tips.unsubscribe()
    tips.unsubscribe((error, success) => {
      if (error) {
        sails.log.error('Failed to disconnect from Thundercore mainnet!');
      }
    });
    tips = listenOnce();
  }, (50 * 1000));
}


module.exports = {
  listen: _listen
};

// _listen()