// This is what Heroku instance will be executing.

var express = require('express');
var app = express();
var path = require('path');
const fetch = require("node-fetch");

app.set('view engine', 'ejs')

app.use(express.json());
app.use(express.urlencoded({ extended: true }))


app.get('/', function (req, res) {
  res.render('indexLocal');
});


app.post('/verifyReceipt', async (req, res) => {
  console.log('Receipt verification active')

  const resp = await fetch('https://webmonetization.org/api/receipts/verify', {
    method: 'POST',
    body: req.body.receipt
  })
  // const { amount } = await resp.json()
  // console.log('Received ' + amount)
  // backend logic for new paid amount
  res.send('ok')
})


// Define your revenue share here.
// If these weights add to 100 then they represent the percent each pointer gets.
const pointers = {
  // // Euro
  // '$ilp.uphold.com/BzR2nf3Yiyak': 20,
  // // USD
  // '$ilp.uphold.com/pNAg9yAgHXZD': 40,
  // // Pounds
  // '$ilp.uphold.com/MXhL7Ub9XQeQ': 10,
  // // Bitcoin
  // '$ilp.uphold.com/3eYm4dKzX4hU': 30,
  // XRP - receipt
  'https://webmonetization.org/api/receipts/%24ilp.uphold.com%2FfH9eZNdYQ64F': 100
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


app.use((req, res, next) => {
  // is this request meant for Web Monetization?
  // console.log(req.headers)

  if (req.header('accept').includes('application/spsp4+json')) {
    console.log('Revenue sharing active')

    // choose our random payment pointer
    const pointer = pickPointer()


    // turn the payment pointer into a URL in accordance with the payment pointer spec
    // https://paymentpointers.org/
    const asUrl = new URL(pointer.startsWith('$') ? 'https://' + pointer.substring(1) : pointer)
    asUrl.pathname = asUrl.pathname === '/' ? '/.well-known/pay' : asUrl.pathname

    console.log('asUrl', asUrl)

    // redirect to our chosen payment pointer so they get paid
    res.redirect(302, asUrl.href)
  } else {
    console.log('Revenue sharing not active')
    // if the request is not for Web Monetization, do nothing
    next()
  }
})








// var express = require('express')
// var app = express()

// var myLogger = function (req, res, next) {
//     console.log('LOGGED')
//     next()
// }

// app.use(myLogger)

// app.get('/', function (req, res) {
//     res.send('Hello World!')
// })


const PORT = process.env.PORT || 1337;
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
