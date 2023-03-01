import { size } from "../global";

export function getRandomPoint() {
	return {
		x: 10 + Math.floor(Math.random() * (size - 1)) * 10,
		y: 10 + Math.floor(Math.random() * (size - 1)) * 10,
	};
}
export function getCirclePosition(elelemt) {
	return {
		x: parseInt(elelemt.getAttribute("cx")),
		y: parseInt(elelemt.getAttribute("cy")),
	};
}
export function setCirclePosition(element, x, y) {
	element.setAttribute("cx", x);
	element.setAttribute("cy", y);
}
export function checkIntersection(pointA, pointB) {
	return pointA.x === pointB.x && pointA.y === pointB.y;
}
