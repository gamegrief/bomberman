import { Scene } from "engine/Scene.js";
import { HALF_TILE_SIZE, STAGE_OFFSET_Y } from "game/constants/game.js";
import { BattleHud } from "game/entities/BattleHud.js";
import { Bomberman } from "game/entities/Bomberman.js";
import { LevelMap } from "game/entities/LevelMap.js";
import { BombSystem } from "game/systems/BombSystem.js";

export class BattleScene extends Scene {
	constructor(time, camera) {
		super();

		this.stage = new LevelMap();
		this.hud = new BattleHud();
		this.bombSystem = new BombSystem(this.stage.collisionMap);
		this.player = new Bomberman(
			{ x: 2, y: 1 },
			time,
			this.stage.collisionMap,
			this.bombSystem.add
		);
		camera.position = { x: HALF_TILE_SIZE, y: STAGE_OFFSET_Y };
	}

	update(time) {
		// Add your main update calls here
		this.bombSystem.update(time);
		this.player.update(time);
	}

	draw(context, camera) {
		this.stage.draw(context, camera);
		this.hud.draw(context);
		this.bombSystem.draw(context, camera);
		this.player.draw(context, camera);
	}

	cleanUp() {
		// Can be used to clean
	}
}
