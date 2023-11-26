import { drawFrame } from "engine/context.js";
import { TILE_SIZE } from "game/constants/game.js";

export class PowerupSystem {
	powerups = [];
	image = document.querySelector("img#power-ups");
	constructor() {}

	remove = (powerup) => {
		const index = this.powerup.indexOf(powerup);
		if (index < 0) return;
		this.powerups.splice(index, 1);
	};
	add = (cell, type) => {
		this.powerups.push({
			type,
			cell,
		});
	};

	update(time, context, camera) {
		// Add your main update calls here
	}

	draw(context, camera) {
		// Add your main draw calls here
		for (const powerup of this.powerups) {
			//ADDED 8 below to accomodate for the image padding at the outer x and y axis
			drawFrame(
				context,
				this.image,
				[8, 8, TILE_SIZE, TILE_SIZE],
				powerup.cell.column * TILE_SIZE - camera.position.x,
				powerup.cell.row * TILE_SIZE + camera.position.y
			);
		}
	}
}
