import { Entity } from "engine/Entity.js";
import { drawTile } from "engine/context.js";
import { tileMap } from "game/constants/LevelData.js";
import { TILE_SIZE } from "game/constants/game.js";
export class LevelMap extends Entity {
	constructor() {
		super({ x: 0, y: 0 });

		this.tileMap = [...tileMap];
		this.image = document.querySelector("img#stage");
		// offscreencanvas allows devs to draw the map off screen and copy it onto the main canvas on the website later on
		this.stageImage = new OffscreenCanvas(1024, 1024);
		this.buildStge();
	}

	updateStageImage(columnIndex, rowIndex, tile) {
		const context = this.stageImage.getContext("2d");
		drawTile(
			context,
			this.image,
			tile,
			columnIndex * TILE_SIZE,
			rowIndex * TILE_SIZE,
			TILE_SIZE
		);
	}

	buildStge() {
		for (let rowIndex = 0; rowIndex < this.tileMap.length; rowIndex++) {
			for (
				let colIndex = 0;
				colIndex < this.tileMap[rowIndex].length;
				colIndex++
			) {
				const tile = this.tileMap[rowIndex][colIndex];
				this.updateStageImage(colIndex, rowIndex, tile);
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
