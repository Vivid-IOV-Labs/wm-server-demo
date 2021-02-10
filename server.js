// This is what Heroku instance will be executing.

var express = require('express');
var app = express();
var path = require('path');
const fetch = require("node-fetch");
var cors = require('cors')
require('dotenv').config()

app.set('view engine', 'ejs')
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors())

const PORT = process.env.PORT || 1337;
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});

const useSmartContract = (process.env.USE_SMART_CONTRACT == 'true') 
const useReceiptVerification = (process.env.USE_RECEIPT_VERIFICATION == 'true')
const pickPointerSmartContract = require('./revenueSharing')

// Use smartContract or not to pick payment pointers.
if (useSmartContract) {
  console.log('Using smart contract for revenue sharing')
} else {
  console.log('Not using smart contract for revenue sharing')
}

// Use receipt verification or not.
if (useReceiptVerification) {
  console.log('Receipt verification: Activated')
} else {
  console.log('Receipt verification: Deactivated')
}


app.post('/verifyReceipt', async (req, res) => {
  const resp = await fetch('https://webmonetization.org/api/receipts/verify', {
    method: 'POST',
    body: req.body.receipt
  })
  try {
    const { amount } = await resp.json()
    console.log('Received ' + amount)
    res.send({ message: 'ok', data: { received: amount } })
  } catch (error) {
    res.status(400).send(error)
  }
  // backend logic for new paid amount

})


// Define your revenue share here.
// If these weights add to 100 then they represent the percentage each pointer gets.
const pointers = {
  // Euro
  '$ilp.uphold.com/BzR2nf3Yiyak': 20,
  // USD
  '$ilp.uphold.com/pNAg9yAgHXZD': 40,
  // Pounds
  '$ilp.uphold.com/MXhL7Ub9XQeQ': 10,
  // Bitcoin
  '$ilp.uphold.com/3eYm4dKzX4hU': 10,
  // XRP
  '$ilp.uphold.com/fH9eZNdYQ64F': 20,
}

const pointersForReceipt = {
  // Euro
  'https://webmonetization.org/api/receipts/%24ilp.uphold.com%2FBzR2nf3Yiyak': 20, //receipt
  // USD
  'https://webmonetization.org/api/receipts/%24ilp.uphold.com%2FpNAg9yAgHXZD': 40, //receipt
  // Pounds
  'https://webmonetization.org/api/receipts/%24ilp.uphold.com%2FMXhL7Ub9XQeQ': 10, //receipt
  // Bitcoin
  'https://webmonetization.org/api/receipts/%24ilp.uphold.com%2F3eYm4dKzX4hU': 10, //receipt
  // XRP
  'https://webmonetization.org/api/receipts/%24ilp.uphold.com%2FfH9eZNdYQ64F': 20, //receipt
}

// this is the same `pickPointer()` function implemented in the previous snippet
function pickPointer() {
  const sum = Object.values(pointers).reduce((sum, weight) => sum + weight, 0)
  let choice = Math.random() * sum

  if (useReceiptVerification) {
    pointers = pointersForReceipt
  }

  for (const pointer in pointers) {
    const weight = pointers[pointer]
    if ((choice -= weight) <= 0) {
      return pointer
    }
  }
}

// NOTE: If you want to have separetly the frontend and the backend (2 instances), you need to use app.get('/') instead of app.use()

app.get('/', async function (req, res, next) {
  // is this request meant for Web Monetization?

  if (req.header('accept').includes('application/spsp4+json')) {
    console.log('Revenue sharing active')

    // choose our random payment pointer
    if (useSmartContract) {
      var pointer = await pickPointerSmartContract(useReceiptVerification)
    } else {
      var pointer = pickPointer()
    }

    console.log('Payment pointer = ', pointer)

    // turn the payment pointer into a URL in accordance with the payment pointer spec
    // https://paymentpointers.org/
    const asUrl = new URL(pointer.startsWith('$') ? 'https://' + pointer.substring(1) : pointer)
    asUrl.pathname = asUrl.pathname === '/' ? '/.well-known/pay' : asUrl.pathname

    // redirect to our chosen payment pointer so they get paid
    res.redirect(302, asUrl.href)
  } else {
    console.log('Revenue sharing not active')
    // if the request is not for Web Monetization, do nothing
    next()
  }
})

