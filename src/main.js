const express = require('express');

const app = express();

const puppeteer = require('puppeteer');

app.use(express.json());
app.use(express.urlencoded());
const port = 3002;

app.post('/', async (req, res) => {
  try {
      const { apikey, userid, password, pin } = req.body;

      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();

      await page.setViewport({ width: 1280, height: 800 });
      await page.goto(`https://kite.trade/connect/login?api_key=${apikey}&v=3`);
      const navigationPromise = page.waitForNavigation();
      await page.waitForSelector('#userid', { timeout: 5000 });
      await page.type('#userid', userid);

      await page.waitForSelector('#password', { timeout: 5000 });
      await page.type('#password', password);

      await page.click('#container > div > div > div.login-form > form > div.actions > button');

      await page.waitForSelector('#pin', { timeout: 5000 });
      await page.type('#pin', pin);

      await page.click('#container > div > div > div.login-form > form > div.actions > button');
      await navigationPromise;
      const url = await page.url();

      await browser.close();
      res.json({
        url,
      });
  }
  catch (err) {
    console.log(err)
    res.status(404).json({
      'message':'invalid creds'
    });
  }

});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
