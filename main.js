import "./style.css";
import "./setup/container";
import { resetScore, incrementScore } from "./setup/score";
import {
	getCirclePosition,
	setCirclePosition,
	getRandomPoint,
	checkIntersection,
} from "./utils/circle.utils";

import { size, tick } from "./global";

const svgContainer = document.getElementById("svgContainer");
const inputReader = document.getElementById("inputReader");
const overlay = document.getElementById("overlay");
const eatPoint = document.getElementById("eatPoint");
let lastKeyDeltaTime = Date.now();
document.getElementById("playButton").onclick = play;
let snakeSegments = [];
let input = { x: 10, y: 0 };
let intervalId;

initializeInputReader();
play();

function initializeSnake() {
	const randomPosition = getRandomPoint();
	const randomDirection = { x: 0, y: 0 };
	const randomAxis = Math.random() > 0.5 ? "x" : "y";
	const randomValue = Math.random() > 0.5 ? 1 : -1;
	randomDirection[randomAxis] = randomValue;
	input = { x: -randomDirection.x * 10, y: -randomDirection.y * 10 };
	const head = document.createElementNS("http://www.w3.org/2000/svg", "circle");
	head.setAttribute("cx", randomPosition.x);
	head.setAttribute("cy", randomPosition.y);
	const tail = document.createElementNS("http://www.w3.org/2000/svg", "circle");
	tail.setAttribute("cx", randomPosition.x + randomDirection.x * 10);
	tail.setAttribute("cy", randomPosition.y + randomDirection.y * 10);
	svgContainer.replaceChildren(head, tail);
	snakeSegments = [head, tail];
}
function initializeEatPoint() {
	svgContainer.append(eatPoint);
	randomizeEatPoint();
}
function initializeInputReader() {
	inputReader.addEventListener("blur", event => event.target.focus());
	inputReader.addEventListener("keyup", event => {
		if (Date.now() - lastKeyDeltaTime < tick) return;
		lastKeyDeltaTime = Date.now();
		switch (event.code) {
			case "KeyW":
			case "ArrowUp":
				if (input.y === 10) break;
				input = { x: 0, y: -10 };
				break;
			case "KeyA":
			case "ArrowLeft":
				if (input.x === 10) break;
				input = { x: -10, y: 0 };
				break;
			case "KeyS":
			case "ArrowDown":
				if (input.y === -10) break;
				input = { x: 0, y: 10 };
				break;
			case "KeyD":
			case "ArrowRight":
				if (input.x === -10) break;
				input = { x: 10, y: 0 };
				break;
		}
	});
}
function updateSnake() {
	intervalId = setInterval(() => {
		const nextHeadPosition = getNextHeadPosition();
		if (checkSelfIntersection(nextHeadPosition)) lose();

		const eatPointPosition = getCirclePosition(eatPoint);

		const positions = [nextHeadPosition];
		for (let i = 1; i < snakeSegments.length; i++) positions.push(getCirclePosition(snakeSegments[i - 1]));
		for (let i = 0; i < snakeSegments.length; i++)
			setCirclePosition(snakeSegments[i], positions[i].x, positions[i].y);

		if (checkIntersection(nextHeadPosition, eatPointPosition)) {
			addSnakeSegment();
			randomizeEatPoint();
			incrementScore();
		}
	}, tick);
}
function checkSelfIntersection(nextHeadPosition) {
	for (let i = 1; i < snakeSegments.length; i++)
		if (checkIntersection(nextHeadPosition, getCirclePosition(snakeSegments[i]))) return true;

	return false;
}
function getNextHeadPosition() {
	const prevHeadPosition = getCirclePosition(snakeSegments[0]);
	const nextHeadPosition = { x: prevHeadPosition.x + input.x, y: prevHeadPosition.y + input.y };
	if (nextHeadPosition.x === size * 10) nextHeadPosition.x = 10;
	else if (nextHeadPosition.x === 0) nextHeadPosition.x = (size - 1) * 10;
	if (nextHeadPosition.y === size * 10) nextHeadPosition.y = 10;
	else if (nextHeadPosition.y === 0) nextHeadPosition.y = (size - 1) * 10;
	return nextHeadPosition;
}
function addSnakeSegment() {
	const segment = document.createElementNS("http://www.w3.org/2000/svg", "circle");
	segment.setAttribute("r", 5);
	const lastSegmentPos = getCirclePosition(snakeSegments[snakeSegments.length - 1]);
	setCirclePosition(segment, lastSegmentPos.x, lastSegmentPos.y);
	snakeSegments.push(segment);
	svgContainer.appendChild(segment);
}
function randomizeEatPoint() {
	let randomPoint;
	let snakeIntersection = true;
	while (snakeIntersection) {
		randomPoint = getRandomPoint();
		snakeIntersection = false;
		for (let i = 0; i < snakeSegments.length; i++) {
			const segmentPosition = getCirclePosition(snakeSegments[i]);
			if (checkIntersection(randomPoint, segmentPosition)) {
				snakeIntersection = true;
				break;
			}
		}
	}
	setCirclePosition(eatPoint, randomPoint.x, randomPoint.y);
}

function lose() {
	overlay.classList.remove("overlay--hidden");
	clearInterval(intervalId);
}
function play() {
	overlay.classList.add("overlay--hidden");
	resetScore();
	initializeSnake();
	initializeEatPoint();
	updateSnake();
}
