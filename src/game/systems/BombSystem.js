import { CollisionTile } from "game/constants/LevelData.js";
import { Bomb } from "game/entities/Bomb.js";
export class BombSystem {
	bombs = [];
	constructor(stageCollisionMap) {
		this.collisionMap = stageCollisionMap;
	}

	remove = (bomb) => {
		const index = this.bombs.indexOf(bomb);
		if (index < 0) return;
		this.collisionMap[bomb.cell.row][bomb.cell.column] = CollisionTile.EMPTY;

		this.bombs.splice(index, 1);
	};
	add = (cell, time, onBombExploed) => {
		this.bombs.push(
			new Bomb(cell, time, (bomb) => {
				this.remove(bomb);
				onBombExploed(bomb);
			})
		);

		this.collisionMap[cell.row][cell.column] = CollisionTile.BOMB;
	};
	update(time, context, camera) {
		// Add your main update calls here
		for (const bomb of this.bombs) {
			bomb.update(time);
		}
	}

	draw(context, camera) {
		// Add your main draw calls here
		for (const bomb of this.bombs) {
			bomb.draw(context, camera);
		}
	}
}
