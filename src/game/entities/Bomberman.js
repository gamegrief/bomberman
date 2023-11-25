import { Entity } from "engine/Entity.js";
import { drawFrameOrigin } from "engine/context.js";
import * as control from "engine/inputHandler.js";
import { CollisionTile } from "game/constants/LevelData.js";
import { Control } from "game/constants/controls.js";
import {
	BombermanStateType,
	WALK_SPEED,
	animations,
	frames,
} from "game/constants/bomberman.js";
import {
	CounterDirectionsLookup,
	Direction,
	MovementLookup,
} from "game/constants/entities.js";
import {
	FRAME_TIME,
	HALF_TILE_SIZE,
	TILE_SIZE,
	DEBUG,
} from "game/constants/game.js";
import { drawBox, drawCross } from "game/utils/debug.js";
import { isZero } from "game/utils/utils.js";

export class Bomberman extends Entity {
	image = document.querySelector("img#bomberman");

	id = 0;
	direction = Direction.DOWN;
	baseSpeedTime = WALK_SPEED;
	speedMultiplier = 1.2;
	animation = animations.moveAnimation[this.direction];

	bombAmount = 1;
	availableBombs = this.bombAmount;

	constructor(position, time, stageCollisionMap, onBombPlaced) {
		super({
			x: position.x * TILE_SIZE + HALF_TILE_SIZE,
			y: position.y * TILE_SIZE + HALF_TILE_SIZE,
		});
		this.state = {
			[BombermanStateType.IDLE]: {
				type: BombermanStateType.IDLE,
				init: this.handleIdleInit,
				update: this.handleIdleState,
			},
			[BombermanStateType.MOVING]: {
				type: BombermanStateType.MOVING,
				init: this.handleMovingInit,
				update: this.handleMovingState,
			},
		};

		this.collisionMap = stageCollisionMap;
		this.onBombPlaced = onBombPlaced;
		this.changeState(BombermanStateType.IDLE, time);
	}

	changeState(newState, time) {
		this.currentState = this.state[newState];
		this.animationFrame = 0;
		this.currentState.init(time);
		this.animationTimer =
			time.previous + this.animation[this.animationFrame][1] * FRAME_TIME;
	}

	//done check
	getCollisionTile(tile) {
		return this.collisionMap[tile.row][tile.column];
	}

	getCollisionCoords(direction) {
		switch (direction) {
			case Direction.UP:
				return [
					{
						row: Math.floor((this.position.y - 9) / TILE_SIZE),
						column: Math.floor((this.position.x - 8) / TILE_SIZE),
					},
					{
						row: Math.floor((this.position.y - 9) / TILE_SIZE),
						column: Math.floor((this.position.x + 7) / TILE_SIZE),
					},
				];
			case Direction.LEFT:
				return [
					{
						row: Math.floor((this.position.y - 8) / TILE_SIZE),
						column: Math.floor((this.position.x - 9) / TILE_SIZE),
					},
					{
						row: Math.floor((this.position.y + 7) / TILE_SIZE),
						column: Math.floor((this.position.x - 9) / TILE_SIZE),
					},
				];
			case Direction.RIGHT:
				return [
					{
						row: Math.floor((this.position.y - 8) / TILE_SIZE),
						column: Math.floor((this.position.x + 8) / TILE_SIZE),
					},
					{
						row: Math.floor((this.position.y + 7) / TILE_SIZE),
						column: Math.floor((this.position.x + 8) / TILE_SIZE),
					},
				];
			default:
			case Direction.DOWN:
				return [
					{
						row: Math.floor((this.position.y + 8) / TILE_SIZE),
						column: Math.floor((this.position.x - 8) / TILE_SIZE),
					},
					{
						row: Math.floor((this.position.y + 8) / TILE_SIZE),
						column: Math.floor((this.position.x + 7) / TILE_SIZE),
					},
				];
		}
	}

	//done check
	shouldBlockMovement(tileCoords) {
		const tileCoordsMatch =
			tileCoords[0].column == tileCoords[1].column &&
			tileCoords[0].row == tileCoords[1].row;
		const collisionTiles = [
			this.getCollisionTile(tileCoords[0]),
			this.getCollisionTile(tileCoords[1]),
		];
		if (
			(tileCoordsMatch && collisionTiles[0] >= CollisionTile.WALL) ||
			(collisionTiles[0] >= CollisionTile.WALL &&
				collisionTiles[1] >= CollisionTile.WALL)
		) {
			return true;
		}
		return false;
	}
	//done check
	performWallCheck(direction) {
		const collisionCoords = this.getCollisionCoords(direction);

		if (this.shouldBlockMovement(collisionCoords))
			return [this.direction, { x: 0, y: 0 }];

		const counterDirections = CounterDirectionsLookup[direction];
		if (this.getCollisionTile(collisionCoords[0]) >= CollisionTile.WALL) {
			return [
				counterDirections[0],
				{ ...MovementLookup[counterDirections[0]] },
			];
		}
		if (this.getCollisionTile(collisionCoords[1]) >= CollisionTile.WALL) {
			return [
				counterDirections[1],
				{ ...MovementLookup[counterDirections[1]] },
			];
		}
		return [direction, { ...MovementLookup[direction] }];
	}
	//done check
	getMovement = () => {
		if (control.isLeft(this.id)) {
			return this.performWallCheck(Direction.LEFT);
		} else if (control.isRight(this.id)) {
			return this.performWallCheck(Direction.RIGHT);
		} else if (control.isDown(this.id)) {
			return this.performWallCheck(Direction.DOWN);
		} else if (control.isUp(this.id)) {
			return this.performWallCheck(Direction.UP);
		}

		return [this.direction, { x: 0, y: 0 }];
	};

	handleIdleInit = () => {
		this.velocity = { x: 0, y: 0 };
	};

	handleMovingInit = () => {
		this.animationFrame = 1;
	};

	handleGeneralState = (time) => {
		const [direction, velocity] = this.getMovement();
		if (control.isControlPressed(this.id, Control.ACTION))
			this.handleBombPlacement(time);
		this.animation = animations.moveAnimation[direction];
		this.direction = direction;
		return velocity;
	};

	handleIdleState = (time) => {
		const velocity = this.handleGeneralState(time);
		if (isZero(velocity)) return;
		this.changeState(BombermanStateType.MOVING, time);
	};

	handleMovingState = (time) => {
		this.velocity = this.handleGeneralState(time);
		if (!isZero(this.velocity)) return;
		this.changeState(BombermanStateType.IDLE, time);
	};

	handleBombPlacement(time) {
		if (this.availableBombs <= 0) return;
		const playerCell = {
			row: Math.floor(this.position.y / TILE_SIZE),
			column: Math.floor(this.position.x / TILE_SIZE),
		};

		//make sure that the current cell is empty
		if (
			this.collisionMap[playerCell.row][playerCell.column] !==
			CollisionTile.EMPTY
		)
			return;

		this.availableBombs -= 1;

		this.onBombPlaced(playerCell, time);
	}
	//done check
	updatePosition(time) {
		this.position.x +=
			this.velocity.x *
			this.baseSpeedTime *
			this.speedMultiplier *
			time.secondsPassed;
		this.position.y +=
			this.velocity.y *
			this.baseSpeedTime *
			this.speedMultiplier *
			time.secondsPassed;
	}

	//done check
	updateAnimation(time) {
		if (
			time.previous < this.animationTimer ||
			this.currentState.type === BombermanStateType.IDLE
		)
			return;

		this.animationFrame += 1;
		if (this.animationFrame >= this.animation.length) this.animationFrame = 0;

		this.animationTimer =
			time.previous + this.animation[this.animationFrame][1] * FRAME_TIME;
	}

	//done check
	update(time) {
		this.updatePosition(time);
		this.currentState.update(time);
		this.updateAnimation(time);
	}

	draw(context, camera) {
		// Add your main draw calls here
		const [frameKey] = this.animation[this.animationFrame];
		const frame = frames.get(frameKey);

		drawFrameOrigin(
			context,
			this.image,
			frame,
			Math.floor(this.position.x - camera.position.x),
			// not sure why video says its - camera.position.y but it doesnt work
			Math.floor(this.position.y + camera.position.y),
			[this.direction === Direction.RIGHT ? -1 : 1, 1]
		);

		if (!DEBUG) return;

		drawBox(
			context,
			camera,
			[
				this.position.x - HALF_TILE_SIZE,
				this.position.y - HALF_TILE_SIZE,
				TILE_SIZE - 1,
				TILE_SIZE - 1,
			],
			"#FFFF00"
		);
		drawCross(
			context,
			camera,
			{ x: this.position.x, y: this.position.y },
			"#FFF"
		);
	}
}
