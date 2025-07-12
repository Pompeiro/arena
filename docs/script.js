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

	checkIsOccupied() {
		return this.element.style.fill != "none";
	}

	draw(color = this.color) {
		this.element.style.fill = color;
	}
	addCustomId(id) {
		this.element.setAttribute("CUSTOMID", id);
	}
	removeCustomId() {
		this.element.removeAttribute("CUSTOMID");
	}
	drawBorder() {
		this.element.style.fill = "none";

		this.element.style.stroke = "#D6CFC7";
		this.element.style.strokeWidth = this.strokeWidth;
	}

	clear() {
		this.element.style.fill = "none";
		this.clearText();
	}

	addText(text) {
		let textElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
		textElement.id = `text-${this.x}${this.y}`;
		textElement.setAttribute("x", this.x + 20);
		textElement.setAttribute("y", this.y + 20);
		textElement.style.fontSize = 15;
		textElement.style.fontWeight = 400;
		textElement.innerHTML = text;
		this.svgLayer.appendChild(textElement);
	}
	clearText() {
		let text = document.getElementById(`text-${this.x}${this.y}`);
		if (text != null) {
			this.svgLayer.removeChild(text);

		}
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


class TeamData {
	constructor(color, direction, minionSpawnRow) {
		this.color = color;
		this.direction = direction;
		this.minionSpawnRow = minionSpawnRow;
	}
}

class Line {

	lineHeightByRectangleCount = gridRowCount;
	minions = [];
	constructor(gridPart, lineWidthByRectangleCount = 3, svgLayer = svgLayer2, color = "#E6E6FA", strokeWidth = 4, strokeColor = "#D6CFC7", element = document.createElementNS("http://www.w3.org/2000/svg", "rect",)) {

		const { x, y, width, height } = gridPart[0][0]
		this.gridPart = gridPart;
		this.svgLayer = svgLayer;
		this.x = x;
		this.y = y;
		this.lineWidthByRectangleCount = lineWidthByRectangleCount;
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
	constructor(hp = 100, attack = 25, range = 1) {
		this.hp = hp;
		this.attack = attack;
		this.range = range;
	}
}

var customId = 0;
function customIdIncrement() {
	customId++;
	return `${customId}`;
}
class Minion {
	previousRow = 0;
	movePriorityModifier = 10;
	isFightMode = false;
	customId = customIdIncrement();
	movePriority = 0;
	absorbAttackPriority = 0;
	constructor(row, column, direction = -1, color = "#B0C4DE", stats = new Stats(500, 25, 1)) {
		this.row = row;
		this.previousRow = row;
		this.column = column;
		this.previousColumn = column;
		this.color = color;
		this.direction = direction;
		this.stats = stats;
		this.maxHp = this.stats.hp;
	}

	addToMoveQueue() {
		this.movePriority = this.movePriorityModifier + this.row * this.direction
		moveQueue.push(this);
	}

	addToFightQueue() {
		console.log("Add to fight queue with setting priority by lowest hp and most left column");
		this.absorbAttackPriority = this.maxHp / this.stats.hp + 1 / (this.column + 1) / 100;
		fightQueue.push(this);
	}

	move() {
		console.log("Minion move")
		if (this.row + this.direction > grid.length - 1 || this.row + this.direction < 0) {
			console.error("Grid Border has been reached!")
			return null;
		}
		if (grid[this.row + this.direction][this.column].checkIsOccupied() == false) {
			this.previousRow = this.row;
			this.row = this.row + this.direction;
			this.render();
		}
		else {
			if (this.isFightMode == false) {
				console.log("Checking remaining columns in width 3 line");
				let columnsToCheck = [];
				switch (this.column % 3) {
					case 0:
						columnsToCheck = [1, 2];
						break;
					case 1:
						columnsToCheck = [-1, 1];
						break;
					case 2:
						columnsToCheck = [-2, -1];
						break;
				}
				for (let i of columnsToCheck) {
					if (grid[this.row + this.direction][this.column + i].checkIsOccupied() == false) {
						this.previousRow = this.row;
						this.previousColumn = this.column;
						this.row = this.row + this.direction
						this.column = this.column + i
						this.render();
						console.log("Found free column, pushing minion forward");
						return null;
					}

				}
			}
			console.error("Cant move forward, forward row is occupied");
		}

	}

	absorbAttack(attack) {
		this.stats.hp = this.stats.hp - attack;
		console.log("Minion absorbed attack", { attack });
		if (this.stats.hp <= 0) {
			this.stats.attack = 0;
			this.clear();
			return null;
		}
		this.render();
	}

	updateState() {
		console.log("Minion updateState");
		if (this.isFightMode == true) {
			this.addToFightQueue();
		}
		else {
			this.addToMoveQueue();
		}
	}

	render(color = this.color, text = `hp:${this.stats.hp}`) {
		if (this.isFightMode == true) {
			grid[this.row][this.column].clearText();
			grid[this.row][this.column].addText(text);
			return null;
		}
		grid[this.previousRow][this.previousColumn].clear();
		grid[this.previousRow][this.previousColumn].removeCustomId();
		grid[this.row][this.column].draw(color);
		grid[this.row][this.column].addCustomId(this.customId);
		grid[this.row][this.column].addText(text);
	}
	clear() {
		grid[this.row][this.column].clear();
		grid[this.row][this.column].removeCustomId();
		grid[this.row][this.column].clearText();
	}


}

class Team {
	minions = [];
	fightModeRow = null;
	constructor(teamData) {
		this.teamData = teamData;
	}

	spawnMinions(amount) {
		for (let i = 0; i < amount; i++) {
			this.minions.push(new Minion(this.teamData.minionSpawnRow, i, this.teamData.direction, this.teamData.color));
			console.log("Team:", this.teamData.color, "Spawned minion, minions:", this.minions)
		}
	}

	spawnMinionsByRow(row, amount) {
		for (let i = 0; i < amount; i++) {
			this.minions.push(new Minion(row, i, this.teamData.direction, this.teamData.color));
			console.log("Team:", this.teamData.color, "Spawned minion, minions:", this.minions)
		}
	}

	removeDeadMinions() {
		let previousLength = this.minions.length;
		this.minions = this.minions.filter((minion) => minion.stats.hp > 0);
		console.log("Team:", this.teamData.color, "Remove dead minions")
		if (previousLength < this.minions.length) {
			console.log("Removed count:", previousLength - this.minions.length);
		}
	}


	getMinionsUniqueRows() {
		let uniqueRows = [...new Set(this.minions.map((minion) => minion.row))];
		console.log("Team:", this.teamData.color, "getMinionsUniqueRows");
		console.log({ uniqueRows });
		return uniqueRows;
	}

	getFarawayRow() {
		let farawayRow = 0;
		if (this.teamData.direction == 1) {
			farawayRow = Math.max(...this.getMinionsUniqueRows());
		}
		else {
			farawayRow = Math.min(...this.getMinionsUniqueRows());
		}

		console.log("Team:", this.teamData.color, "getFarawayRow");

		console.log({ farawayRow });
		return farawayRow;
	}

	getMinionsInRangeToEnemyRow(enemyRow) {
		console.log("Team:", this.teamData.color, "getMinionsInRangeToEnemyRow");
		let minionsInRange = this.minions.filter((minion) => minion.stats.range >= Math.abs(minion.row - enemyRow));
		if (minionsInRange.length > 0) {
			console.log("Found minions in range");
		} else {
			console.log("Minions in range not found");
		}
		return minionsInRange;
	}

	getMinionsOutOfRangeToEnemyRow(enemyRow) {
		console.log("Team:", this.teamData.color, "getMinionsOutOfRangeToEnemyRow");
		let minionsOutOfRange = this.minions.filter((minion) => minion.stats.range < Math.abs(minion.row - enemyRow));
		if (minionsOutOfRange.length > 0) {
			console.log("Found minions out of range");
		} else {
			console.log("Minions out of range not found");
		}
		return minionsOutOfRange;
	}

	setMinionsFightModeByRangeToEnemyRow(enemyRow) {
		console.log("Team:", this.teamData.color, "setMinionsFightModeByRangeToEnemyRow");
		for (let [i, minion] of this.getMinionsInRangeToEnemyRow(enemyRow).entries()) {
			minion.isFightMode = true;
			console.log("SET is fight mode for minion");
			if (i == 0) {
				this.fightModeRow = minion.row;
			}
		}
		for (let [i, minion] of this.getMinionsOutOfRangeToEnemyRow(enemyRow).entries()) {
			minion.isFightMode = false;
			console.log("RESET is fight mode for minion");
			if (i == this.minions.length - 1) {
				this.fightModeRow = null;
			}
		}
	}

	getMinionsWithFightMode() {
		let minionsWithFightMode = this.minions.filter((minion) => minion.isFightMode == true)
		console.log("Team:", this.teamData.color, "getMionionsWithFightMode");
		console.log({ minionsWithFightMode });
		return minionsWithFightMode;
	}


	sumMinionsAttack() {
		let sumResult = this.minions.reduce((accumulator, currentValue) => accumulator + currentValue.stats.attack, 0);
		console.log("Team:", this.teamData.color, "sumMinionsAttack");
		console.log({ sumResult });
		return sumResult;
	}

	sumMinionsWithFightModeAttack() {
		console.log("Team:", this.teamData.color, "sumMinionsWithFightModeAttack");
		let sumResult = this.getMinionsWithFightMode().reduce((accumulator, currentValue) => accumulator + currentValue.stats.attack, 0);
		console.log({ sumResult });
		return sumResult;
	}

	sumMinionsAttackInRangeToEnemyRow(enemyRow) {
		console.log("Team:", this.teamData.color, "sumMinionsAttackInRangeToEnemyRow");
		let sumResult = this.getMinionsInRangeToEnemyRow(enemyRow).reduce((accumulator, currentValue) => accumulator + currentValue.stats.attack, 0);
		console.log({ sumResult });
		return sumResult;
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
	grid.push(currentRow);
}
console.table(grid);
console.log("Grid element count is: ", grid.length);



for (let gridRow of grid) {
	for (let gridCol of gridRow) {
		gridCol.drawBorder();
	}
}
let teamRedData = new TeamData("#D8A7B1", 1, row = 0);
let teamBlueData = new TeamData("#B0C4DE", -1, row = grid.length - 1);

let teamRed = new Team(teamRedData)
teamRed.spawnMinions(3);

let teamBlue = new Team(teamBlueData)

teamBlue.spawnMinionsByRow(1, 1);
teamBlue.spawnMinionsByRow(3, 2);
teamBlue.spawnMinionsByRow(6, 3);
teamBlue.spawnMinionsByRow(7, 3);
const lines = [];
const amountOfLines = 3;
const lineWidthByRectangleCount = 3;
for (let i = 0; i < amountOfLines; i++) {
	let gridPart = [];
	for (let row of grid) {
		gridPart.push(row.slice(i * 4, i * 4 + lineWidthByRectangleCount));
	}

	lines.push(new Line(gridPart, lineWidthByRectangleCount));
}





//const tower = grid[1][6]

//const towerCircle = new Circle(cx = tower.x + gridRectangleWidth / 2, cy = tower.y + gridRectangleHeight / 2, r = gridRectangleWidth / 2 * 3)
//towerCircle.draw()

//tower.draw("#B0C4DE")

//const tower2 = grid[7][6]

//const tower2Circle = new Circle(cx = tower2.x + gridRectangleWidth / 2, cy = tower2.y + gridRectangleHeight / 2, r = gridRectangleWidth / 2 * 3)

//tower2.draw("#B0C4DE")
//tower2Circle.draw()


for (let line of lines) {
	line.draw()
}

lines[0].minions = [...teamRed.minions, ...teamBlue.minions];
console.log(lines[0].minions);
for (let m of lines[0].minions) {
	m.render();
}
var keysPressed = [];
function processUserInput() {
	console.table(keysPressed);
	let aPressedCounter = keysPressed.filter((key) => key == "a");
	if (aPressedCounter.length > 0) {
	}
}



var moveQueue = [];
var fightQueue = [];

function updateState() {
	moveQueue = [];
	fightQueue = [];
	teamRed.removeDeadMinions();
	teamBlue.removeDeadMinions();
	let aliveMinions = [...teamRed.minions, ...teamBlue.minions];
	console.table(aliveMinions);
	console.info(teamRed.getMinionsUniqueRows());


	teamRed.setMinionsFightModeByRangeToEnemyRow(teamBlue.getFarawayRow());
	teamBlue.setMinionsFightModeByRangeToEnemyRow(teamRed.getFarawayRow());
	let teamRedCurrentTurnAttack = teamRed.sumMinionsWithFightModeAttack();
	let teamBlueCurrentTurnAttack = teamBlue.sumMinionsWithFightModeAttack();

	for (let m of aliveMinions) {
		m.updateState();
	}
	if (fightQueue.length > 0) {
		fightQueue = fightQueue.sort((a, b) => (b.absorbAttackPriority - a.absorbAttackPriority));
		console.log("fightQueue table");
		console.table(fightQueue);
		let teamRedMinionToAbsorbAttack = fightQueue.find((x) => x.color == teamRed.teamData.color);
		let teamBlueMinionToAbsorbAttack = fightQueue.find((x) => x.color == teamBlue.teamData.color);

		teamRedMinionToAbsorbAttack.absorbAttack(teamBlueCurrentTurnAttack);
		teamBlueMinionToAbsorbAttack.absorbAttack(teamRedCurrentTurnAttack);
	}

	moveQueue = moveQueue.sort((a, b) => b.movePriority - a.movePriority);
	console.table(moveQueue)
	for (m of moveQueue) {
		m.move();
	}


}

function render() {
	for (let m of teamRed.minions) {
		m.render();
	}
	for (let m of teamBlue.minions) {
		m.render();
	}

}
function gameLoop() {
	processUserInput();
	updateState();
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


