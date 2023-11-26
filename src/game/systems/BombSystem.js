import { CollisionTile } from "game/constants/LevelData.js";
import { FlameDirectionLookup } from "game/constants/bombs.js";
import { Bomb } from "game/entities/Bomb.js";
import { BombExposion } from "game/entities/BombExplosion.js";
export class BombSystem {
	bombs = [];
	constructor(stageCollisionMap) {
		this.collisionMap = stageCollisionMap;
	}

	getFlameCellsFor(rowOffset, columnOffset, startCell, length) {
		const flameCells = [];
		let cell = { ...startCell };
		console.log(length);
		for (let position = 1; position <= length; position++) {
			cell.row += rowOffset;
			cell.column += columnOffset;

			if (this.collisionMap[cell.row][cell.column] !== CollisionTile.EMPTY)
				break;

			flameCells.push({
				cell: { ...cell },
				isVertical: rowOffset !== 0,
				isLast: position === length,
			});
		}
		return flameCells;
	}

	getFlameCells = (startCell, length, time) => {
		const flameCells = [];

		for (const [rowOffset, columnOffset] of FlameDirectionLookup) {
			const cells = this.getFlameCellsFor(
				rowOffset,
				columnOffset,
				startCell,
				length
			);
			if (cells.length > 0) flameCells.push(...cells);
		}
		return flameCells;
	};

	handleBombExploded = (bomb, strength, time) => {
		const index = this.bombs.indexOf(bomb);
		if (index < 0) return;

		const flameCells = this.getFlameCells(bomb.cell, strength, time);
		this.bombs[index] = new BombExposion(
			bomb.cell,
			flameCells,
			time,
			this.remove
		);
		this.collisionMap[bomb.cell.row][bomb.cell.column] = CollisionTile.FLAME;
		for (const flameCell of flameCells) {
			this.collisionMap[flameCell.cell.row][flameCell.cell.column] =
				CollisionTile.FLAME;
		}
	};

	remove = (bombExplosion) => {
		const index = this.bombs.indexOf(bombExplosion);
		if (index < 0) return;
		this.collisionMap[bombExplosion.cell.row][bombExplosion.cell.column] =
			CollisionTile.EMPTY;
		for (const flameCell of bombExplosion.flameCells) {
			this.collisionMap[flameCell.cell.row][flameCell.cell.column] =
				CollisionTile.FLAME;
		}
		this.bombs.splice(index, 1);
	};
	add = (cell, strength, time, onBombExploed) => {
		this.bombs.push(
			new Bomb(cell, time, (bomb) => {
				onBombExploed(bomb);
				this.handleBombExploded(bomb, strength, time);
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
