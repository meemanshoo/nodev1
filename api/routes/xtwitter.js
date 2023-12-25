const express = require('express');
const router = express.Router();
const needle = require('needle');

const got = require('got');
const crypto = require('crypto');
const OAuth = require('oauth-1.0a');
const qs = require('querystring');

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
// Client ID  :  QzMwMTRrNVNlVElST1JhOEZZWHE6MTpjaQ

// Client Secret  :  47FhaCd8XlHEzubTBPsnczHq_kQ4mwI0qTr_TrqnXwxUOWNcRL

// pin : 1452315




const consumer_key = "nAv6ss3jsL87sJEsizN8ZXvFj";
const consumer_secret = "TphMx1iMZsSTcqIszHgvr2qm6KjosvFmrnK5m4SxikaMteoC1Y";



const token = "AAAAAAAAAAAAAAAAAAAAAFuLrgEAAAAAUNIgLIzktIr50CPtcaM%2BgeYSSU0%3DoCqOHWuMbTMz7YgKhzMCuBUhzNv935pnJzwQyF6H6uMNT7ZSOY";
const endpointURL = "https://api.twitter.com/2/users/by?usernames=";

async function getRequest() {
  const params = {
    usernames: "TwitterDev,TwitterAPI",
    "user.fields": "created_at,description",
    "expansions": "pinned_tweet_id"
  };

  const res = await needle('get', endpointURL, params, {
    headers: {
      "User-Agent": "v2UserLookupJS",
      "authorization": `Bearer ${token}`
    }
  });

  if (res.body) {
    return res.body;
  } else {
    throw new Error('Unsuccessful request');
  }
}



/**
 * @swagger
 * /api/xtwitter:
 *   get:
 *     tags:
 *     - xtwitter
 *     summary: get all category
 *     description: https://long-boa-sombrero.cyclic.app/api/xtwitter
 *     responses:
 *       '200':
 *         description: get all category successful
 */


router.get('/xtwitter',async(req,res,next) => {
  try {
    const response = await getRequest();
    res.json(response);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;