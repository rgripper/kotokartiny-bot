import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import { urlencoded } from 'body-parser';
import * as passport from 'passport';
import * as https from 'https';
import { RootObject, WallPostItem, PhotoId, Photo } from './vk/WallGetResponse';
import axios from 'axios'
import { env } from './env';
import { VKCallback } from './vk/VKCallback';
import * as TeleBot from "telebot";
import { relayPostToTelegram } from './RelayBot';

async function downloadPhoto(url: string): Promise<any> {
    const result = await axios.get(url);

    if (result.status != 200) throw new Error(result.statusText);
    return result.data;
}

async function getAllPhotos(photoIds: PhotoId[]): Promise<Photo[]> {
    const response: { data: RootObject<Photo> } = await axios.get(
        `https://api.vk.com/method/photos.get?access_token=${env.vk.accessToken}&photo_ids=${photoIds.join()}&v=5.73`);
    return response.data.response.items;

}

const teleBot = new TeleBot({
    token: env.telegram.botToken
    //allowedUpdates: [],
});

const sendMarkdown = (content: string) => teleBot.sendMessage(env.telegram.destinationChatId, content, { parseMode: 'Markdown' });

const relayPost = (post: WallPostItem) => relayPostToTelegram(post, sendMarkdown);

const count = 10;
axios.get(`https://api.vk.com/method/wall.get?owner_id=-${env.vk.ownerId}&access_token=${env.vk.accessToken}&count=${count}&v=5.73`)
    .then((response: { data: RootObject<WallPostItem> }) => {
        const item = response.data.response.items[0];
        response.data.response.items.forEach(item =>
            relayPost(item).then(x => console.info(`Successfully send post ${item.id}`)).catch(x => console.error(x)))

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
            //relay.sendPost(callback.object);
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


app.get('/', function (req, res) {
    //Here you have an access to req.user
    res.json(req.user);
});