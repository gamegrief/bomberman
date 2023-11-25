import { Entity } from "engine/Entity.js";
import { drawFrameOrigin } from "engine/context.js";
import * as control from "engine/inputHandler.js";
import {
	BombermanStateType,
	WALK_SPEED,
	animations,
	frames,
} from "game/constants/bomberman.js";
import { Direction } from "game/constants/entities.js";
import { FRAME_TIME, HALF_TILE_SIZE, TILE_SIZE } from "game/constants/game.js";
import { isZero } from "game/utils/utils.js";

export class Bomberman extends Entity {
	image = document.querySelector("img#bomberman");

	id = 0;
	direction = Direction.DOWN;
	baseSpeedTime = 1.2;
	speedMultiplier = 1;
	animation = animations.moveAnimation[this.direction];

	constructor(position, time) {
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

		this.changeState(BombermanStateType.IDLE, time);
	}

	changeState(newState, time) {
		this.currentState = this.state[newState];
		this.animationFrame = 0;
		this.animationTimer =
			time.previous + this.animation[this.animationFrame] * FRAME_TIME;

		this.currentState.init(time);
	}

	getMovement = () => {
		if (control.isLeft(this.id)) {
			return [Direction.LEFT, { x: -WALK_SPEED, y: 0 }];
		} else if (control.isRight(this.id)) {
			console.log("test");
			return [Direction.RIGHT, { x: WALK_SPEED, Y: 0 }];
		} else if (control.isDown(this.id)) {
			return [Direction.DOWN, { x: 0, y: WALK_SPEED }];
		} else if (control.isUp(this.id)) {
			return [Direction.UP, { x: 0, y: -WALK_SPEED }];
		}

		return [this.direction, { x: 0, y: 0 }];
	};

	handleIdleInit = () => {
		this.velocity = { x: 0, y: 0 };
	};

	handleMovingInit = () => {
		this.animationFrame = 1;
	};

	handleGeneralState = () => {
		const [direction, velocity] = this.getMovement();
		this.animation = animations.moveAnimation[direction];
		this.direction = direction;
		return velocity;
	};

	handleIdleState = (time) => {
		const velocity = this.handleGeneralState();
		if (isZero(velocity)) return;
		this.changeState(BombermanStateType.MOVING, time);
	};

	handleMovingState = () => {
		this.velocity = this.handleGeneralState();
		if (!isZero(this.velocity)) return;
		this.changeState(BombermanStateType.IDLE, time);
	};

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
		if (time.previous < this.animationTimer) return;

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
	}
}
