import { FRAME_TIME } from "./game.js";
//187 is the pixel index of the bomb frame, where for example base left last bottom is the bottom left of
//the flame explosion, using the FLAME_ANIMATION offset, we are able to retrieve the first to the next 4 frame to the right as some sort of offset. so to get the bottom left explosion in the sprite, we need BASE_LEFT_LAST_FRAME (187+84) + FLAME_ANIMATION (0). to get the tile to the right as a continuation of animation, get the next off set as such: BASE_LEFT_LAST_FRAME (187+84) + FLAME_ANIMATION (1)
export const BASE_FRAME = 187;
export const BASE_HORIZONTAL_FRAME = BASE_FRAME + 88;
export const BASE_VERTICAL_FRAME = BASE_FRAME + 60;
export const BASE_RIGHT_LAST_FRAME = BASE_FRAME + 56;
export const BASE_LEFT_LAST_FRAME = BASE_FRAME + 84;
export const BASE_TOP_LAST_FRAME = BASE_FRAME + 4;
export const BASE_BOTTOM_LAST_FRAME = BASE_FRAME + 32;
export const FUSE_TIMER = 3000;

export const BOMB_FRAME_DELAY = 16 * FRAME_TIME;
export const BOMB_ANIMATION = [0, 1, 2, 1];

// what is the point of the explosion frame delay..?
export const EXPLOSION_FRAME_DELAY = 4 * FRAME_TIME;
export const EXPLOSION_ANIMATION = [3, 29, 30, 31, 30, 29, 28];

export const FLAME_ANIMATION = [0, 1, 2, 3, 2, 1, 0];
//represents row and column values
//eg: 0, -1 is the cell to the left of the bomb
//eg: 1, 0 us the cell to the bottom of the bomb
//eg: 0, 1 is the cell to the right of the bomb
//eg: -1, 0 us the cell to the top of the bomb
export const FlameDirectionLookup = [
	[0, -1],
	[1, 0],
	[0, 1],
	[-1, 0],
];
