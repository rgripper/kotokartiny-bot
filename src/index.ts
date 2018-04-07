import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import { urlencoded } from 'body-parser';
import * as passport from 'passport';
import * as https from 'https';
import { RootObject, WallPostItem, PhotoId, Photo } from './vk/WallGetResponse';
import { RelayBot } from './RelayBot';
import axios from 'axios'
import { env } from './env';
import { VKCallback } from './vk/VKCallback';
import * as TeleBot from "telebot";


async function downloadPhoto(photo: Photo): Promise<any> {
    const result = await axios.get(photo.photo_2560 || photo.photo_1280 || photo.photo_807 
        || photo.photo_604 || photo.photo_130 || photo.photo_75);

    if (result.status != 200) throw new Error(result.statusText);
    return result.data;
}

async function getAllPhotos(photoIds: PhotoId[]): Promise<Photo[]> {
    const response: { data: RootObject<Photo> } = await axios.get(
        `https://api.vk.com/method/photos.get?access_token=${env.vk.accessToken}&photo_ids=${photoIds.join()}&v=5.73`);
    return response.data.response.items;
        
}

const relay = new RelayBot(env.telegram.targetChatId, getAllPhotos, downloadPhoto, new TeleBot({
    token: env.telegram.botToken
    //allowedUpdates: [],
  }));

const count = 10;
axios.get(`https://api.vk.com/method/wall.get?owner_id=-${env.vk.ownerId}&access_token=${env.vk.accessToken}&count=${count}&v=5.73`)
    .then((response: { data: RootObject<WallPostItem> }) => {
        console.log(response.data.response.items);
        const item = response.data.response.items[0];
        relay.sendPost(item).then(x => console.info(`Successfully send post ${item.id}`))
    })
    .catch((error: any) => {
        console.error('error', error);
    });
const app = express();
// User session support middlewares. Your exact suite might vary depending on your app's needs.
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
app.get('/', function (req, res) {
    //Here you have an access to req.user
    const callback = req.body as VKCallback;
    switch (callback.type) {
        case "confirmation": {
            res.sendStatus(200);
            return;
        }
        case "wall_post_new": {
            relay.sendPost(callback.object);
            res.sendStatus(200);
            return;
        }
        default:
            res.status(501).send("Not Implemented");
            return;
    }
});
app.get('/handle', function (req, res) {
    //Here you have an access to req.user
    res.send("Everything is fine");
});
app.listen(22000);


app.get('/', function(req, res) {
    //Here you have an access to req.user
    res.json(req.user);
});