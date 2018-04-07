import { WallPostItem } from "./WallGetResponse";

interface ConfirmationCallback {
    type: "confirmation"
    group_id: string
}

interface WallPostCallback {
    type: "wall_post_new"
    object: WallPostItem
    group_id: string
}

export type VKCallback = ConfirmationCallback | WallPostCallback