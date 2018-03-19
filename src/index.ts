import * as express from 'express';
import { Strategy as VKontakteStrategy } from 'passport-vkontakte';
import * as cookieParser from 'cookie-parser';
import { urlencoded } from 'body-parser';
import * as passport from 'passport';
import * as https from 'https';

axios.get('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY')
  .then(response => {
    console.log(response.data.url);
    console.log(response.data.explanation);
  })
  .catch(error => {
    console.log(error);
  });

 
https.get('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY', (resp) => {
  let data = '';
 
  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
  });
 
  // The whole response has been received. Print out the result.
  resp.on('end', () => {
    console.log(JSON.parse(data).explanation);
  });
 
}).on("error", (err) => {
  console.log("Error: " + err.message);
});

const app = express()
// User session support middlewares. Your exact suite might vary depending on your app's needs.
app.use(cookieParser());
app.use(urlencoded({extended: true}));
app.use(require('express-session')({secret:'keyboard cat', resave: true, saveUninitialized: true}));

https://api.vk.com/method/users.get?user_ids=210700286&fields=bdate&v=5.73

app.get('/auth/vkontakte', passport.authenticate('vkontakte'));

app.get('/auth/vkontakte/callback',
  passport.authenticate('vkontakte', {
    successRedirect: '/',
    failureRedirect: '/login' 
  })
);

app.get('/', function(req, res) {
    //Here you have an access to req.user
    res.json(req.user);
});