import { CollisionTile } from "game/constants/LevelData.js";
import {
	FlameDirectionLookup,
	BOMB_EXPLODE_DELAY,
} from "game/constants/bombs.js";
import { Bomb } from "game/entities/Bomb.js";
import { BombExposion } from "game/entities/BombExplosion.js";
export class BombSystem {
	bombs = [];
	constructor(stageCollisionMap, onBlockDestroyed) {
		this.collisionMap = stageCollisionMap;
		this.onBlockDestroyed = onBlockDestroyed;
	}

	//done check
	getFlameCellsFor(rowOffset, columnOffset, startCell, length) {
		const flameCells = [];
		let cell = { ...startCell };
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
		return { cells: flameCells, endCell: cell };
	}

	handleEndResult(endCell, time) {
		const endResult = this.collisionMap[endCell.row][endCell.column];

		switch (endResult) {
			case CollisionTile.BLOCK: {
				this.onBlockDestroyed(endCell, time);
				break;
			}
			case CollisionTile.BOMB: {
				const bombToExplode = this.bombs.find(
					(bomb) =>
						endCell.row === bomb.cell.row && endCell.column === bomb.cell.column
				);

				if (!bombToExplode) return;
				bombToExplode.fuseTimer = time.previous + BOMB_EXPLODE_DELAY;
				break;
			}
		}
	}

	getFlameCells = (startCell, length, time) => {
		const flameCells = [];

		for (const [rowOffset, columnOffset] of FlameDirectionLookup) {
			const { cells, endCell } = this.getFlameCellsFor(
				rowOffset,
				columnOffset,
				startCell,
				length
			);
			this.handleEndResult(endCell, time);

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
		//place current position as flame
		this.collisionMap[bomb.cell.row][bomb.cell.column] = CollisionTile.FLAME;
		//place radius as flame
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
				CollisionTile.EMPTY;
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
