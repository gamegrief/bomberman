import { Entity } from "engine/Entity.js";
import { SCREEN_WIDTH, STAGE_OFFSET_Y } from "game/constants/game.js";

export class BattleHud extends Entity {
	constructor(position) {
		super(position);

		this.image = document.querySelector("img#hud");
	}

	update(time, context, camera) {
		// Add your main update calls here
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
	}
}
