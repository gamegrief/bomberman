import { Scene } from "engine/Scene.js";
import {
	HALF_TILE_SIZE,
	STAGE_OFFSET_Y,
	NO_PLAYERS,
} from "game/constants/game.js";
import { BattleHud } from "game/entities/BattleHud.js";
import { Bomberman } from "game/entities/Bomberman.js";
import { Stage } from "game/entities/Stage.js";
import { BlockSystem } from "game/systems/BlockSystem.js";
import { BombSystem } from "game/systems/BombSystem.js";
import { PowerupSystem } from "game/systems/PowerupSystem.js";

export class BattleScene extends Scene {
	players = [];
	constructor(time, camera) {
		super();

		this.stage = new Stage();
		this.hud = new BattleHud();
		this.powerupSystem = new PowerupSystem(time, this.players);
		this.blockSystem = new BlockSystem(
			this.stage.updateMapAt,
			this.stage.getCollisionTileAt,
			this.powerupSystem.add
		);
		this.bombSystem = new BombSystem(
			this.stage.collisionMap,
			this.blockSystem.add
		);

		for (let id = 0; id < NO_PLAYERS; id++) {
			this.addPlayer(id, time);
		}
		camera.position = { x: HALF_TILE_SIZE, y: STAGE_OFFSET_Y };
	}

	addPlayer(id, time) {
		this.players.push(
			new Bomberman(
				id,
				time,
				this.stage.getCollisionTileAt,
				this.bombSystem.add
			)
		);
	}

	update(time) {
		// Add your main update calls here
		this.powerupSystem.update(time);
		this.blockSystem.update(time);
		this.bombSystem.update(time);
		for (const player of this.players) {
			player.update(time);
		}
	}

	draw(context, camera) {
		this.stage.draw(context, camera);
		this.hud.draw(context);
		this.powerupSystem.draw(context, camera);
		this.blockSystem.draw(context, camera);
		this.bombSystem.draw(context, camera);

		for (const player of this.players) {
			player.draw(context, camera);
		}
		// this.player.draw(context, camera);
	}

	cleanUp() {
		// Can be used to clean
	}
}
