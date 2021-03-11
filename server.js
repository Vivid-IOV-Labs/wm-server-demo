var express = require('express');
var app = express();
const fetch = require("node-fetch");
var cors = require('cors')
const config = require('./config')
const wmRevenueShare = require('web-monetization-revenue-share')

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors())

const PORT = config.server.port;
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});

wmRevenueShare.setUp('./config')

app.post('/verifyReceipt', async (req, res) => {
  const resp = await fetch(config.receiptVerification.verifier, {
    method: 'POST',
    body: req.body.receipt
  })
  try {
    const { amount, spspEndpoint } = await resp.json()
    console.log(`Received: ${amount}`)
    res.send({
      message: 'ok',
      data: {
        received: amount,
        paymentPointer: spspEndpoint
      }
    })
  } catch (error) {
    res.status(400).send(error)
  }
  // backend logic for new paid amount

})

app.get('/', async function (req, res, next) {
  // is this request meant for Web Monetization?

  if (req.header('accept').includes('application/spsp4+json')) {
    console.log('Revenue sharing active')

    const paymentPointerUrl = await wmRevenueShare.getPointerUrl()
    console.log(`Payment pointer: ${paymentPointerUrl}`)

    // redirect to our chosen payment pointer so they get paid
    res.redirect(302, paymentPointerUrl)
  } else {
    console.log('Revenue sharing not active')
    // if the request is not for Web Monetization, do nothing
    next()
  }
})
