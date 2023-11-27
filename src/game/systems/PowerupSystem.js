import { drawFrame } from "engine/context.js";
import { rectanglesOverlap } from "engine/utils/collisions.js";
import { FRAME_TIME, TILE_SIZE } from "game/constants/game.js";

const FRAME_DELAY = 8 * FRAME_TIME;
export class PowerupSystem {
	powerups = [];
	image = document.querySelector("img#power-ups");
	animationFrame = 0;
	constructor(time, players) {
		this.animationTimer = time.previous + FRAME_DELAY;
		this.players = players;
	}

	getCollisionRectFor = (powerup) => ({
		x: powerup.cell.column * TILE_SIZE,
		y: powerup.cell.row * TILE_SIZE,
		width: TILE_SIZE,
		height: TILE_SIZE,
	});

	remove = (powerup) => {
		const index = this.powerups.indexOf(powerup);
		if (index < 0) return;
		this.powerups.splice(index, 1);
	};
	add = (cell, type) => {
		this.powerups.push({
			type,
			cell,
		});
	};

	updateAnimation(time) {
		if (time.previous <= this.animationTimer) return;

		this.animationFrame = 1 - this.animationFrame;
		this.animationTimer = time.previous + FRAME_DELAY;
	}

	hasPlayerCollided() {
		for (const player of this.players) {
			for (const powerup of this.powerups) {
				if (
					!rectanglesOverlap(
						player.getCollisionRect(),
						this.getCollisionRectFor(powerup)
					)
				)
					continue;

				player.applyPowerup(powerup.type);
				this.remove(powerup);
			}
		}
	}

	update(time) {
		// Add your main update calls here
		this.updateAnimation(time);
		this.hasPlayerCollided();
	}

	draw(context, camera) {
		// Add your main draw calls here
		for (const powerup of this.powerups) {
			// console.log(powerup);
			//ADDED 8 below to accomodate for the image padding at the outer x and y axis
			drawFrame(
				context,
				this.image,
				[
					8 + this.animationFrame * TILE_SIZE,
					8 + (powerup.type - 1) * TILE_SIZE,
					TILE_SIZE,
					TILE_SIZE,
				],
				powerup.cell.column * TILE_SIZE - camera.position.x,
				powerup.cell.row * TILE_SIZE + camera.position.y
			);
		}
	}
}
