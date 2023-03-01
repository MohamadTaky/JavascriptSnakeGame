const scoreContainer = document.getElementById("score");
export function incrementScore() {
	scoreContainer.textContent = parseInt(scoreContainer.textContent) + 1;
}
export function resetScore() {
	scoreContainer.textContent = 0;
}
