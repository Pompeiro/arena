const svgLayer0 = document.getElementById("layer-0");
const svgLayer1 = document.getElementById("layer-1");
const svgLayer2 = document.getElementById("layer-2");

class Rectangle {
	constructor(x, y, width, height, svgLayer = svgLayer0, color = "#8CA8B8", strokeWidth = 4, strokeColor = "#D6CFC7", element = document.createElementNS("http://www.w3.org/2000/svg", "rect")) {
		this.svgLayer = svgLayer;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.color = color;
		this.strokeWidth = strokeWidth;
		this.strokeColor = strokeColor;
		this.element = element;

		this.element.setAttribute("x", x);
		this.element.setAttribute("y", y);
		this.element.setAttribute("width", width);
		this.element.setAttribute("height", height);

		this.element.addEventListener("mouseover", () => {
			this.element.style.fill = "#8CA8B8";
			console.log("hover over");
		});

		this.element.addEventListener("mouseout", () => {
			this.drawBorder();
		});

		this.svgLayer.appendChild(this.element);
	}

	draw(color = this.color) {
		this.element.style.fill = color;
	}

	drawBorder() {
		this.element.style.fill = "none";

		this.element.style.stroke = "#D6CFC7";
		this.element.style.strokeWidth = this.strokeWidth;
	}

	clear() {
		this.element.style.fill = "none";
	}


}

class Circle {
	constructor(cx, cy, r, svgLayer = svgLayer1, color = "#C1B7A4", element = document.createElementNS("http://www.w3.org/2000/svg", "circle")) {
		this.svgLayer = svgLayer;
		this.cx = cx;
		this.cy = cy;
		this.r = r;
		this.color = color;
		this.element = element;

		this.element.setAttribute("cx", cx);
		this.element.setAttribute("cy", cy);
		this.element.setAttribute("r", r);

		document.addEventListener("keydown", (k) => {
			if (k.key == "Shift") {
				this.element.style.fill = "#C8C4D6";
				console.log("shift keydown");
			}
		});

		document.addEventListener("keyup", (k) => {
			if (k.key == "Shift") {
				this.element.style.fill = "none";
			}
		});

		this.svgLayer.appendChild(this.element);
	}

	draw(color = this.color) {
		this.element.style.fill = color;
	}

	drawBorder() {
		this.element.style.fill = "none";

		this.element.style.stroke = "#D6CFC7";
		this.element.style.strokeWidth = this.strokeWidth;
	}

}


class Line {
	lineWidthByRectangleCount = 3;
	lineHeightByRectangleCount = gridRowCount;
	minions = [];
	constructor(gridRectangle, svgLayer = svgLayer2, color = "#E6E6FA", strokeWidth = 4, strokeColor = "#D6CFC7", element = document.createElementNS("http://www.w3.org/2000/svg", "rect")) {
		const { x, y, width, height } = gridRectangle

		this.svgLayer = svgLayer;
		this.gridRectangle = gridRectangle;
		this.x = x;
		this.y = y;
		this.width = width * this.lineWidthByRectangleCount;
		this.height = height * this.lineHeightByRectangleCount;
		this.color = color;
		this.strokeWidth = strokeWidth;
		this.strokeColor = strokeColor;
		this.element = element;

		this.element.setAttribute("x", this.x);
		this.element.setAttribute("y", this.y);
		this.element.setAttribute("width", this.width);
		this.element.setAttribute("height", this.height);

		this.element.style.opacity = 0.5;

		this.svgLayer.appendChild(this.element);
	}

	draw(color = this.color) {
		this.element.style.fill = color;
	}

	drawBorder() {
		this.element.style.fill = "none";

		this.element.style.stroke = "#D6CFC7";
		this.element.style.strokeWidth = this.strokeWidth;
	}

}

class Stats {
	constructor(hp, attack) {
		this.hp = hp;
		this.attack = attack;
	}
}

class Minion {
	previousRow = 0;
	isFightMode = false;
	stats = new Stats(100, 25);
	constructor(row, column, direction = -1, color = "#B0C4DE") {
		this.row = row;
		this.previousRow = row;
		this.column = column;
		this.color = color;
		this.direction = direction;
	}

	move() {
		this.previousRow = this.row;
		this.row = this.row + this.direction;
	}

	absorbAttack(attack) {
		this.stats.hp = this.stats.hp - attack;
		console.log("Minion absorbed attack", { attack });
		if (this.stats.hp <= 0) {
			this.stats.attack = 0;
			this.clear();
		}
	}

	updateState(attack = 0) {
		if (this.isFightMode == true) {
			this.absorbAttack(attack);
		}
		else {
			this.move();
		}
	}

	render(color = this.color) {
		if (this.isFightMode == true) {
			return null;
		}
		grid[this.previousRow][this.column].clear();
		grid[this.row][this.column].draw(color);
	}
	clear() {
		grid[this.row][this.column].clear();
	}


}

const arenaWidth = 800;
const arenaHeight = 600;
const gridRowCount = 8;
const gridColCount = 12;
const grid = [];
const gridRectangleWidth = arenaWidth / gridColCount;
console.log({ gridRectangleWidth })
const gridRectangleHeight = arenaHeight / gridRowCount;
console.log({ gridRectangleHeight })
for (let row = 0; row < gridRowCount; row++) {
	const currentRow = [];
	for (let col = 0; col < gridColCount; col++) {
		let rectangle = new Rectangle(col * gridRectangleWidth, row * gridRectangleHeight, gridRectangleWidth, gridRectangleHeight);
		currentRow.push(rectangle);
	}
	grid.push(currentRow)
}
console.table(grid);
console.log("Grid element count is: ", grid.length);



for (let gridRow of grid) {
	for (let gridCol of gridRow) {
		gridCol.drawBorder();
	}
}


const lines = [];
const amountOfLines = 3;
for (let i = 0; i < amountOfLines; i++) {
	lines.push(new Line(grid[0][i * 4]));
}




grid[2][3].draw();
grid[5][5].draw();

const tower = grid[1][6]

const towerCircle = new Circle(cx = tower.x + gridRectangleWidth / 2, cy = tower.y + gridRectangleHeight / 2, r = gridRectangleWidth / 2 * 3)
towerCircle.draw()

tower.draw("#B0C4DE")

const tower2 = grid[7][6]

const tower2Circle = new Circle(cx = tower2.x + gridRectangleWidth / 2, cy = tower2.y + gridRectangleHeight / 2, r = gridRectangleWidth / 2 * 3)

tower2.draw("#B0C4DE")
tower2Circle.draw()


for (let line of lines) {
	line.draw()
}
const minion1 = new Minion(row = grid.length - 1, column = 0);
const minion2 = new Minion(row = grid.length - 1, column = 1);
const minion3 = new Minion(row = grid.length - 1, column = 2);

const minion4 = new Minion(row = 0, column = 0, direction = 1, color = "#D8A7B1");
const minion5 = new Minion(row = 0, column = 1, direction = 1, color = "#D8A7B1");
const minion6 = new Minion(row = 0, column = 2, direction = 1, color = "#D8A7B1");
lines[0].minions = [minion1, minion2, minion3, minion4, minion5, minion6];
for (let m of lines[0].minions) {
	m.render();
}
var keysPressed = [];
function processInput() {
	console.table(keysPressed);
}

function updateState() {
	let aPressedCounter = keysPressed.filter((key) => key == "a");
	if (aPressedCounter.length > 0) {
	}

	if ((lines[0].minions[0].row - lines[0].minions[lines[0].minions.length - 1].row) == 1) {
		for (let m of lines[0].minions) {
			m.isFightMode = true;
		}
	}

	let aliveMinions = lines[0].minions.filter((value) => value.stats.attack > 0);
	console.table(aliveMinions);
	let minionsAttackSum = aliveMinions.reduce((accumulator, currentValue) => accumulator + currentValue.stats.attack, 0);
	console.log({ minionsAttackSum });
	aliveMinions.shift().updateState(attack = minionsAttackSum / 2);
	aliveMinions.pop().updateState(attack = minionsAttackSum / 2);
	for (let m of aliveMinions) {
		m.updateState();
	}



}

function render() {
	for (let m of lines[0].minions) {
		m.render();
	}

}
function gameLoop() {
	processInput();
	updateState();
	render();
}

const help = document.getElementById("help");
const helpBase = "Press ctrl to trigger game loop, A to move"
help.textContent = `${helpBase} list of keys pressed: ${keysPressed}`
document.addEventListener("keydown", (k) => {
	if (k.key == "Control") {
		gameLoop();
		keysPressed = [];
		help.textContent = `${helpBase} list of keys pressed: ${keysPressed}`
	}
	else {
		keysPressed.push(k.key);
		help.textContent = `${helpBase} list of keys pressed: ${keysPressed}`
	}
});


