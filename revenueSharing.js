const config = require('./config')
const util = require('util')
const Web3 = require('web3');
var web3 = new Web3(config.smartContract.provider);
const { ABI } = require(config.smartContract.abiFilePath)

var contract = new web3.eth.Contract(ABI, config.smartContract.address)

const _pointer = async (useReceiptVerification) => {
  var totalPercentage = await contract.methods.getTotalPercentage().call()
  var randomNum = parseInt(Math.random() * totalPercentage)
  var pointer = await contract.methods.pickPointer(randomNum).call()
  
  if (useReceiptVerification) {
    pointer = config.receiptVerification.service + encodeURIComponent(pointer)
  }
  return pointer
}

module.exports = (useReceiptVerification) => {
  return _pointer(useReceiptVerification)
};
