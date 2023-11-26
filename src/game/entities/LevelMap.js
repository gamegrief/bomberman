import { Entity } from "engine/Entity.js";
import { drawTile } from "engine/context.js";
import {
	CollisionTile,
	MAX_BLOCKS,
	MapTile,
	MapToCollisionTileLookup,
	playerStartCoords,
	tileMap,
} from "game/constants/LevelData.js";
import { TILE_SIZE } from "game/constants/game.js";
import { collisionMap, STAGE_MAP_MAX_SIZE } from "game/constants/LevelData.js";

export class LevelMap extends Entity {
	tileMap = [...tileMap];
	collisionMap = [...collisionMap];
	image = document.querySelector("img#stage");
	// offscreencanvas allows devs to draw the map off screen and copy it onto the main canvas on the website later on
	stageImage = new OffscreenCanvas(STAGE_MAP_MAX_SIZE, STAGE_MAP_MAX_SIZE);
	constructor() {
		super({ x: 0, y: 0 });
		this.stageImageContext = this.stageImage.getContext("2d");
		this.buildStge();
	}

	updateMapAt(cell, tile) {
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
	}

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

	addBlockTileAt(cell) {
		const isStartZone = playerStartCoords.some(
			([startRow, startColumn]) =>
				startRow === cell.row && startColumn === cell.column
		);

		if (
			isStartZone ||
			this.collisionMap[cell.row][cell.column] !== CollisionTile.EMPTY
		)
			return false;

		this.updateMapAt(cell, MapTile.BLOCK);
		return true;
	}

	addBlocks() {
		const blocks = [];

		while (blocks.length < MAX_BLOCKS) {
			const cell = {
				row: 1 + Math.floor(Math.random() * (this.tileMap.length - 3)),
				column: 2 + Math.floor(Math.random() * (this.tileMap[0].length - 4)),
			};

			if (this.addBlockTileAt(cell)) blocks.push(cell);
		}
	}

	buildStge() {
		this.buildStageMap();
		this.addBlocks();
	}
	update = () => undefined;

	draw(context, camera) {
		//advantage of calling offscreencanvas is that its only initialised once and can be called multiple times
		//it will not rerender every frame. tdlr: efficiency
		// not sure why video says its - camera.position.y but it doesnt work
		context.drawImage(this.stageImage, -camera.position.x, camera.position.y);
	}
}
