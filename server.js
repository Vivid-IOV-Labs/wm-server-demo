// This is what Heroku instance will be executing.

var express = require('express');
var app = express();
var path = require('path');
const fetch = require("node-fetch");
var cors = require('cors')
require('dotenv').config()

const pickPointerSmartContract = require('./revenueSharing')


app.set('view engine', 'ejs')

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use(cors())

// Use smartContract or not to pick payment pointers.
const useSmartContract = process.env.USE_SMART_CONTRACT
if (useSmartContract) {
    console.log('Using smart contract for revenue sharing')
} else {
    console.log('Not using smart contract for revenue sharing')
}

app.post('/verifyReceipt', async (req, res) => {
    console.log('Receipt verification active')

    const resp = await fetch('https://webmonetization.org/api/receipts/verify', {
        method: 'POST',
        body: req.body.receipt
    })
    var response = resp
    try {
        // const { amount } = await resp.json()
        const response = await resp.json()
        console.log('Received ' + response)
        res.send({message: 'ok', response: response})
    } catch (error) {
        console.log('RESPONSE: ', response)
        console.log('ERROR: ', error)
        res.status(400).send(error)
    }
    // backend logic for new paid amount
    
})


// Define your revenue share here.
// If these weights add to 100 then they represent the percentage each pointer gets.
const pointers = {
    // // Euro
    // '$ilp.uphold.com/BzR2nf3Yiyak': 20,
    'https://webmonetization.org/api/receipts/%24ilp.uphold.com%2FBzR2nf3Yiyak': 20, //receipt
    // // USD
    // '$ilp.uphold.com/pNAg9yAgHXZD': 40,
    'https://webmonetization.org/api/receipts/%24ilp.uphold.com%2FpNAg9yAgHXZD': 40, //receipt
    // // Pounds
    // '$ilp.uphold.com/MXhL7Ub9XQeQ': 10,
    'https://webmonetization.org/api/receipts/%24ilp.uphold.com%2FMXhL7Ub9XQeQ': 10, //receipt
    // // Bitcoin
    // '$ilp.uphold.com/3eYm4dKzX4hU': 30,
    // XRP - receipt
    'https://webmonetization.org/api/receipts/%24ilp.uphold.com%2FfH9eZNdYQ64F': 30
}

// this is the same `pickPointer()` function implemented in the previous snippet
function pickPointer() {
    const sum = Object.values(pointers).reduce((sum, weight) => sum + weight, 0)
    let choice = Math.random() * sum

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
            var pointer = await pickPointerSmartContract.pointer
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


const PORT = process.env.PORT || 1337;
app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
});
