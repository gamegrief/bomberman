import { Entity } from "engine/Entity.js";
import { SCREEN_WIDTH, STAGE_OFFSET_Y } from "game/constants/game.js";
import { drawText } from "game/utils/drawText.js";

export class BattleHud extends Entity {
	image = document.querySelector("img#hud");
	//holds minute and seconds timer
	clock = [3, 0];
	constructor(time, state) {
		super({ x: 0, y: 0 });
		this.state = state;
		this.clockTimer = time.previous + 1000;
	}

	updateClock(time) {
		if (time.previous < this.clockTimer) return;

		this.clock[1] -= 1;
		this.clockTimer = time.previous + 1000;

		if (this.clock[1] < 0 && this.clock[0] > 0) {
			this.clock[0] -= 1;
			this.clock[1] = 59;
		}
	}

	update(time) {
		// Add your main update calls here
		this.updateClock(time);
	}

	draw(context, camera) {
		// Add your main draw calls here
		//using bottom section of the hud.png file inzstead of the top one with screen width of 256 and offset of 24
		context.drawImage(
			this.image,
			8,
			40,
			SCREEN_WIDTH,
			STAGE_OFFSET_Y,
			0,
			0,
			SCREEN_WIDTH,
			STAGE_OFFSET_Y
		);

		//padStart ensures its always 2 characters in length eg: 09
		drawText(
			context,
			`${String(this.clock[0])}:${String(this.clock[1]).padStart(2, "0")}`,
			32,
			8
		);

		for (const id in this.state.wins) {
			//104 is the base start of the pixel, where 32 is the distance between every bomberman score
			drawText(context, String(this.state.wins[id]), 104 + id * 32, 8, 8);
		}
	}
}
