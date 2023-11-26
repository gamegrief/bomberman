import { Entity } from "engine/Entity.js";
import { drawTile } from "engine/context.js";
import {
	STAGE_MAP_MAX_SIZE,
	CollisionTile,
	MapToCollisionTileLookup,
	stageData,
} from "game/constants/LevelData.js";
import { TILE_SIZE } from "game/constants/game.js";

export class Stage extends Entity {
	tileMap = structuredClone(stageData.tiles);
	collisionMap = stageData.tiles.map((row) =>
		row.map((tile) => MapToCollisionTileLookup[tile])
	);
	image = document.querySelector("img#stage");
	// offscreencanvas allows devs to draw the map off screen and copy it onto the main canvas on the website later on
	stageImage = new OffscreenCanvas(STAGE_MAP_MAX_SIZE, STAGE_MAP_MAX_SIZE);
	constructor() {
		super({ x: 0, y: 0 });
		this.stageImageContext = this.stageImage.getContext("2d");
		this.buildStageMap();
	}

	getCollisionTileAt = (cell) => {
		return this.collisionMap[cell.row][cell.column] ?? CollisionTile.EMPTY;
	};

	updateMapAt = (cell, tile) => {
		this.tileMap[cell.row][cell.column] = tile;
		this.collisionMap[cell.row][cell.column] = MapToCollisionTileLookup[tile];

		drawTile(
			this.stageImageContext,
			this.image,
			tile,
			cell.column * TILE_SIZE,
			cell.row * TILE_SIZE,
			TILE_SIZE
		);
	};

	buildStageMap() {
		for (let rowIndex = 0; rowIndex < this.tileMap.length; rowIndex++) {
			for (
				let colIndex = 0;
				colIndex < this.tileMap[rowIndex].length;
				colIndex++
			) {
				const tile = this.tileMap[rowIndex][colIndex];
				this.updateMapAt({ row: rowIndex, column: colIndex }, tile);
			}
		}
	}

	update = () => undefined;

	draw(context, camera) {
		//advantage of calling offscreencanvas is that its only initialised once and can be called multiple times
		//it will not rerender every frame. tdlr: efficiency
		// not sure why video says its - camera.position.y but it doesnt work
		context.drawImage(this.stageImage, -camera.position.x, camera.position.y);
	}
}
