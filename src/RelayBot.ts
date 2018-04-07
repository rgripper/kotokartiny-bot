import { WallPostItem, Photo, Sticker, PhotoId } from "./vk/WallGetResponse";
import * as TeleBot from "telebot";

export class RelayBot {
  constructor(
    private targetChatId: string,
    private getPhotos: (photoIds: PhotoId[]) => Promise<Photo[]>,
    private downloadPhoto: (photo: Photo) => Promise<any>,
    private bot: TeleBot 
  ) {}

  async sendPhoto(photo: Photo): Promise<any> {
    const photoFile = this.downloadPhoto(photo);

    return await this.bot.sendPhoto(this.targetChatId, photoFile, {
      caption: photo.text
    });
  }

  async sendPost(post: WallPostItem): Promise<void> {
    if (post.text) {
      await this.bot.sendMessage(this.targetChatId, post.text);
    }
    for (const attachment of post.attachments) {
      switch (attachment.type) {
        case "photo":
          await this.sendPhoto(attachment.photo);
          return;
        case "link":
          await this.bot.sendMessage(this.targetChatId,
            `<a href="${attachment.link.url}">${attachment.link.url}</a>`,
            { parseMode: "HTML" }
          );
          return;
        case "photos_list":
        case "sticker":
        case "album":
        default:
          console.warn(`Attachment type ${attachment.type} is not supported`);
          return;
      }
    }
  }
}
