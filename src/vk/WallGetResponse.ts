export interface Size {
    type: string;
    url: string;
    width: number;
    height: number;
}

export interface Photo {
    id: PhotoId;
    album_id: number;
    owner_id: number;

    sizes: Size[];
    text: string;
    date: number;

    user_id?: number;
    access_key?: string;
    post_id?: number;

    photo_75: string;
    photo_130?: string;
    photo_604?: string;
    photo_807?: string;
    photo_1280?: string;
    photo_2560?: string;
}

export interface Link {
    url: string;
    title: string;
    description: string;
    target: string;
    photo: Photo;
}

export interface Thumb {
    id: number;
    album_id: number;
    owner_id: number;
    user_id: number;
    sizes: Size[];
    text: string;
    date: number;
    access_key: string;
}

export interface Album {
    id: string;
    thumb: Thumb;
    owner_id: number;
    title: string;
    description: string;
    created: number;
    updated: number;
    size: number;
}

type Url = string
export type PhotoId = number

export type Attachment = 
| {
    type: "photo";
    photo: Photo;
}
| {
    type: "link";
    link: Link;
}
| {
    type: "album";
    album: Album;
}
| {
    type: "sticker";
    sticker: Sticker;
}
| {
    type: "photos_list";
    photos_list: PhotoId[];
}

export interface Sticker {
    product_id: number;
    photo_64: Url;
    photo_128: Url;
    photo_256: Url;
    photo_352: Url;
    width: number;
    height: number;
}

export interface PostSource {
    type: string;
    platform?: string;
}

export interface Comments {
    count: number;
    groups_can_post: boolean;
    can_post: number;
}

export interface Likes {
    count: number;
    user_likes: number;
    can_like: number;
    can_publish: number;
}

export interface Reposts {
    count: number;
    user_reposted: number;
}

export interface Views {
    count: number;
}

export interface CopyHistory {
    id: number;
    owner_id: number;
    from_id: number;
    date: number;
    post_type: string;
    text: string;
    attachments: Attachment[];
    post_source: PostSource;
}

export interface WallPostItem {
    id: number;
    from_id: number;
    owner_id: number;
    date: number;
    marked_as_ads: number;
    post_type: 'post' | 'copy' | 'reply' | 'postpone';
    text: string;
    is_pinned: number;
    attachments: Attachment[];
    post_source: PostSource;
    comments: Comments;
    likes: Likes;
    reposts: Reposts;
    views: Views;
    copy_history: CopyHistory[];
    signer_id?: number;
}

export interface Response<T> {
    count: number;
    items: T[];
}

export interface RootObject<T> {
    response: Response<T>;
}
