var express = require('express');
var app = express();
// var path = require('path');
// const fetch = require("node-fetch");
var cors = require('cors')
const config = require('./config')

var wmRevenueShare = require('web-monetization-revenue-share')
wmRevenueShare.setUp('/config')




app.set('view engine', 'ejs')
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors())

const PORT = config.server.port;
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});

temp = async () => {

  // wmRevenueShare.setUp('/config')
  // console.log(wmRevenueShare)
  var paymentPointerUrl = await wmRevenueShare.pointerUrl()
  console.log(paymentPointerUrl)
}

temp()

app.post('/verifyReceipt', async (req, res) => {
  const resp = await fetch(config.receiptVerification.verifier, {
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


app.get('/', async function (req, res, next) {
  // is this request meant for Web Monetization?
  
  if (req.header('accept').includes('application/spsp4+json')) {
    console.log('Revenue sharing active')

    const paymentPointerUrl = await wmRevenueShare.pointerUrl()

    // redirect to our chosen payment pointer so they get paid
    res.redirect(302, paymentPointerUrl)
  } else {
    console.log('Revenue sharing not active')
    // if the request is not for Web Monetization, do nothing
    next()
  }
})
