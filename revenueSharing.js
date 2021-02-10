require('dotenv').config()
const util = require('util')
const Web3 = require('web3');
const provider = `wss://rinkeby.infura.io/ws/v3/${process.env.INFURA_KEY}`
var web3 = new Web3(provider);
const revenueSharingContract = require('./revenueSharingContract')

var contract = new web3.eth.Contract(revenueSharingContract.ABI, revenueSharingContract.address)

const _pointer = async (useReceiptVerification) => {
  var totalPercentage = await contract.methods.getTotalPercentage().call()
  var randomNum = parseInt(Math.random() * totalPercentage)
  var pointer = await contract.methods.pickPointer(randomNum).call()
  
  if (useReceiptVerification) {
    const receiptVerifierService = 'https://webmonetization.org/api/receipts/'
    pointer = receiptVerifierService + encodeURIComponent(pointer)
  }
  return pointer
}

module.exports = (useReceiptVerification) => {
  return _pointer(useReceiptVerification)
};
