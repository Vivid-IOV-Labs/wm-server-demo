#### Heroku deployment
  When deployed in Heroku `server.js` is executed 
 
#### Test Heroku instanse locally.
  
  - Replace `https://revsharetest.peerkat.live/` in `views/indexTestHeroku.ejs` with the url of your deployed server instance. <br>
    For example:

        ...
        <meta name="monetization" content="https://your-deployed-server-instance-url/">
        ...
        const res = await fetch('https://your-deployed-server-instance-url/verifyReceipt', {
        ...

  - Start local server 
  
      node serverTestHeroku.js

  - visit `http://localhost:1337`
