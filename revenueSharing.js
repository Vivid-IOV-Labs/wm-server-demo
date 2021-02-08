require('dotenv').config()
const util = require('util')
const Web3 = require('web3');
// const provider = 'wss://mainnet-ws.thundercore.com'
const provider = `wss://rinkeby.infura.io/ws/v3/${process.env.INFURA_KEY}`
var web3 = new Web3(provider);
// const BigNumber = require('bignumber.js');

// const tippingContract = require('./tippingContract')
const revenueSharingContract = require('./revenueSharingContract')
// const simpleStorage = require('./simpleStorage')


// var contract = new web3.eth.Contract(tippingContract.ABI, tippingContract.address)
var contract = new web3.eth.Contract(revenueSharingContract.ABI, revenueSharingContract.address)
// var contract = new web3.eth.Contract(simpleStorage.ABI, simpleStorage.address)
// console.log(contract)

const _pointer = async () => {
  // var getValue = await contract.methods.get().call()
  var totalPercentage = await contract.methods.getTotalPercentage().call()
  var randomNum = parseInt(Math.random() * totalPercentage)
  var pointer = await contract.methods.pickPointer(randomNum).call()
  
  const  receiptVerifierService = 'https://webmonetization.org/api/receipts/'
  pointer = receiptVerifierService + encodeURIComponent(pointer)
  return pointer
  // let number = new BigNumber(123);
  // var setValue = await contract.methods.set(number).call()
  // console.log(setValue)
}

module.exports = {
  pointer: _pointer()
};
