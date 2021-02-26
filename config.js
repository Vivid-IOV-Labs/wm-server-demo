require('dotenv').config()

const config = {
  server: {
    port: process.env.PORT || 1337
  },
  useSmartContract: process.env.USE_SMART_CONTRACT || 'true',
  useReceiptVerification: process.env.USE_RECEIPT_VERIFICATION || 'true',
  paymentPointersPath: './paymentPointers',
  receiptVerification:{ 
    service: 'https://webmonetization.org/api/receipts/',
    verifier: 'https://webmonetization.org/api/receipts/verify'
  },
  smartContract: {
    provider: 'rinkeby',
    key: process.env.INFURA_KEY,
    abiFilePath: './smartContractInfo'
  }
 };
 
 module.exports = config;
 