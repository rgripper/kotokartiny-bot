import {
    WallPostItem,
    Photo,
    Sticker,
    PhotoId,
    Attachment
} from "./vk/WallGetResponse";
import * as TeleBot from "telebot";

enum SendableType {
    Photo,
    Text
}

type Sendable =
    | {
        type: SendableType.Photo;
        url: string;
    }
    | {
        type: SendableType.Text;
        text: string;
    };

const getPhotoUrl = (photo: Photo) =>
    photo.photo_2560 ||
    photo.photo_1280 ||
    photo.photo_807 ||
    photo.photo_604 ||
    photo.photo_130 ||
    photo.photo_75;

export function convertAttachmentToSendable(attachment: Attachment, getPhotoUrl: (photo: Photo) => string): Sendable | undefined {
    switch (attachment.type) {
        case "photo":
            return { type: SendableType.Photo, url: getPhotoUrl(attachment.photo) };
        case "link": // gets automatically included in the text of a message
        // return { type: SendableType.Link, url: attachment.link.url };
        case "photos_list":
        case "sticker":
        case "album":
        default:
            console.warn(`Attachment type ${attachment.type} is not supported`);
            return;
    }
}

export function convertPostToMessage(
    post: WallPostItem,
    convertAttachmentToSendable: (attachment: Attachment) => Sendable | undefined
): string {
    let markdown = post.text;


    if (post.attachments) {
        const sendables = post.attachments.map(convertAttachmentToSendable).filter(x => x != undefined) as Sendable[];
        const imgs = sendables.filter(s => s.type === SendableType.Photo).map(s => `![image](${(s as any).url})`).join('');
        markdown = markdown + imgs;
    }

    return markdown;
}

export const relayPostToTelegram = (post: WallPostItem, sendMarkdown: (content: string) => Promise<void>): Promise<void> => {
    const markdown = convertPostToMessage(post, x => convertAttachmentToSendable(x, getPhotoUrl));
    return sendMarkdown(markdown);
}