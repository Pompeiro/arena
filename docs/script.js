const svgLayer0 = document.getElementById("layer-0");
const svgLayer1 = document.getElementById("layer-1");
const svgLayer2 = document.getElementById("layer-2");

const COLUMNS_IN_LINE = 3;

const TEAM_RED = "red";
const TEAM_BLUE = "blue";
const TEAM_RED_MINION_COLOR = "rgb(216, 167, 177)";
const TEAM_BLUE_MINION_COLOR = "rgb(176, 196, 222)";

const redTeamColors = [TEAM_RED_MINION_COLOR];
const blueTeamColors = [TEAM_BLUE_MINION_COLOR];

var globalAllAttackableObjects = [];
var globalMinions = [];
function removeDeadMinions() {
	let previousLength = globalMinions.length;
	globalMinions = globalMinions.filter((minion) => minion.stats.hp > 0);
	if (previousLength < globalMinions.length) {
		console.log("Removed minions count:", previousLength - globalMinions.length);
	}
}

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

	getOccupiedBy() {

		if (this.element.style.fill == "none") {
			return "none";
		} else if (redTeamColors.includes(this.element.style.fill)) {
			return TEAM_RED;
		}
		else if (blueTeamColors.includes(this.element.style.fill)) {
			return TEAM_BLUE;
		}
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

	getCustomId() {
		return this.element.getAttribute("CUSTOMID");
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
	constructor(color, direction, minionSpawnRow, team, enemyTeam) {
		this.color = color;
		this.direction = direction;
		this.minionSpawnRow = minionSpawnRow;
		this.team = team;
		this.enemyTeam = enemyTeam;
	}
}

class Line {
	heightByRectangleCount = gridRowCount;
	redTeamMinions = [];
	blueTeamMinions = [];
	constructor(gridPart, columnStartingPoint = 0, widthByRectangleCount = 3, svgLayer = svgLayer2, color = "#E6E6FA", strokeWidth = 4, strokeColor = "#D6CFC7", element = document.createElementNS("http://www.w3.org/2000/svg", "rect",)) {

		const { x, y, width, height } = gridPart[0][0]
		this.gridPart = gridPart;
		this.svgLayer = svgLayer;
		this.x = x;
		this.y = y;
		this.columnStartingPoint = columnStartingPoint;
		this.widthByRectangleCount = widthByRectangleCount;
		this.width = width * this.widthByRectangleCount;
		this.height = height * this.heightByRectangleCount;
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

	spawnMinionsByTeam(team) {
		team.spawnMinionsByLine(this);
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
	targetRow = null;
	customId = customIdIncrement();
	movePriority = 0;
	attackToAbsorb = 0;
	constructor(row, column, direction = -1, team = TEAM_BLUE, enemyTeam = TEAM_RED, color = TEAM_BLUE_MINION_COLOR, lineOffset = 0, stats = new Stats(300, 25, 1)) {
		this.row = row;
		this.previousRow = row;
		this.column = column;
		this.previousColumn = column;
		this.color = color;
		this.direction = direction;
		this.team = team;
		this.enemyTeam = enemyTeam;
		this.lineOffset = lineOffset;
		this.stats = stats;
		this.maxHp = this.stats.hp;
	}

	getEnemiesColumns() {
		let enemiesColumns = [];
		switch ((this.column - this.lineOffset) % 3) {
			case 0:
				enemiesColumns = [0, 1, 2];
				break;
			case 1:
				enemiesColumns = [-1, 0, 1];
				break;
			case 2:
				enemiesColumns = [-2, -1, 0];
				break;
		}
		return enemiesColumns;
	}



	setTargetRow() {
		this.targetRow = null;
		let minimumRange = 1;
		for (let i = minimumRange; i <= this.stats.range; i++) {
			if (this.row + (i * this.direction) > grid.length - 1 || this.row + (i * this.direction) < 0) {
				//turn off searching outside grid
				return this.targetRow;
			}
			for (let col of this.getEnemiesColumns()) {
				if (grid[this.row + (i * this.direction)][this.column + col].getOccupiedBy() == this.enemyTeam) {
					this.targetRow = this.row + (i * this.direction);
					console.error("found enemy row in range")
					return this.targetRow;
				}
			}
		}
		return this.targetRow;
	}

	attackTargetRow() {
		console.log("Attack lowest hp and most left column");
		let targets = [];
		for (let col of this.getEnemiesColumns()) {
			if (grid[this.targetRow][this.column + col].getOccupiedBy() == this.enemyTeam) {
				let targetId = grid[this.targetRow][this.column + col].getCustomId();
				targets.push(globalMinions.find((x) => x.customId == targetId));
			}
		}
		targets.sort((a, b) => (b.maxHp / b.stats.hp + 1 / (b.column + 1) / 100) - (a.maxHp / a.stats.hp + 1 / (a.column + 1) / 100));
		targets[0].attackToAbsorb = targets[0].attackToAbsorb + this.stats.attack;
	}

	getSwapColumns() {
		let swapColumns = [];
		switch (this.column % 3) {
			case 0:
				swapColumns = [1, 2];
				break;
			case 1:
				swapColumns = [-1, 1];
				break;
			case 2:
				swapColumns = [-2, -1];
				break;
		}
		return swapColumns;
	}

	swapColumn() {
		console.log("Checking remaining columns in width 3 line");
		for (let i of this.getSwapColumns()) {
			if (grid[this.row + this.direction][this.column + i].getOccupiedBy() == "none") {
				this.previousRow = this.row;
				this.previousColumn = this.column;
				this.row = this.row + this.direction
				this.column = this.column + i
				this.render();
				this.previousColumn = this.column;
				console.log("Found free column, pushing minion forward");
				return true;
			}
		}

		console.error("Cant move forward, forward row is occupied");

	}

	setMovePriority() {
		this.movePriority = this.movePriorityModifier + this.row * this.direction;
	}

	move() {
		console.log("Minion move");
		if (this.row + this.direction > grid.length - 1 || this.row + this.direction < 0) {
			console.error("Grid Border has been reached!")
			return null;
		}
		if (grid[this.row + this.direction][this.column].getOccupiedBy() == "none") {
			this.previousRow = this.row;
			this.row = this.row + this.direction;
			this.render();
		}
		else {
			if (grid[this.row + this.direction][this.column].getOccupiedBy() == this.team) {
				this.swapColumn()
			}
		}

	}

	absorbAttack() {
		this.stats.hp = this.stats.hp - this.attackToAbsorb;
		console.log("Minion absorbed attack", this.attackToAbsorb);
		this.attackToAbsorb = 0;
		if (this.stats.hp <= 0) {
			this.clear();
			return null;
		}
		this.render();
	}

	updateState() {
		console.log("Minion updateState");
		if (this.setTargetRow() == null) {
			this.move();
			// workaround as red team moves first to be able to attack in the same turn
			if (this.team == TEAM_RED) {
				if (this.setTargetRow() != null) {
					this.attackTargetRow();
				}
			}
		}
		else {
			this.attackTargetRow();
		}
		this.setMovePriority();
	}

	render(color = this.color, text = `hp:${this.stats.hp}`) {
		if (this.targetRow != null) {
			grid[this.row][this.column].clearText();
			grid[this.row][this.column].addText(text);
			return null;
		}
		grid[this.previousRow][this.previousColumn].clear();
		grid[this.previousRow][this.previousColumn].removeCustomId();
		grid[this.row][this.column].draw(color);
		grid[this.row][this.column].addCustomId(this.customId);
		grid[this.row][this.column].clearText();
		grid[this.row][this.column].addText(text);
	}

	clear() {
		grid[this.row][this.column].clear();
		grid[this.row][this.column].removeCustomId();
		grid[this.row][this.column].clearText();
	}

}

class Team {
	constructor(teamData) {
		this.teamData = teamData;
	}

	spawnMinions(amount) {
		for (let i = 0; i < amount; i++) {
			globalMinions.push(new Minion(this.teamData.minionSpawnRow, i, this.teamData.direction, this.teamData.team, this.teamData.enemyTeam, this.teamData.color, 0));
			console.log("Team:", this.teamData.color, "Spawned minion, minions:", globalMinions)
		}
	}

	spawnMinionsByRow(row, amount) {
		for (let i = 0; i < amount; i++) {
			globalMinions.push(new Minion(row, i, this.teamData.direction, this.teamData.team, this.teamData.enemyTeam, this.teamData.color, 0));
			console.log("Team:", this.teamData.color, "Spawned minion, minions:", globalMinions)
		}
	}

	spawnMinionsByLine(line, amount = 3) {
		for (let i = 0; i < amount; i++) {
			let spawnedMinion = new Minion(this.teamData.minionSpawnRow, line.columnStartingPoint + i, this.teamData.direction, this.teamData.team, this.teamData.enemyTeam, this.teamData.color, line.columnStartingPoint);
			globalMinions.push(spawnedMinion);
			console.log("Team:", this.teamData.color, "Spawned minion, minions:", globalMinions)
		}
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
let teamRedData = new TeamData(TEAM_RED_MINION_COLOR, 1, 0, TEAM_RED, TEAM_BLUE);
let teamBlueData = new TeamData(TEAM_BLUE_MINION_COLOR, -1, grid.length - 1, TEAM_BLUE, TEAM_RED);

let teamRed = new Team(teamRedData)
teamRed.spawnMinions(1);

let teamBlue = new Team(teamBlueData)

teamBlue.spawnMinionsByRow(2, 2);
teamBlue.spawnMinionsByRow(3, 3);

const lines = [];
const amountOfLines = 3;
const lineWidthByRectangleCount = 3;
for (let i = 0; i < amountOfLines; i++) {
	let gridPart = [];
	for (let row of grid) {
		gridPart.push(row.slice(i * 4, i * 4 + lineWidthByRectangleCount));
	}

	lines.push(new Line(gridPart, i * 4, lineWidthByRectangleCount));
}


lines[1].spawnMinionsByTeam(teamRed);



lines[2].spawnMinionsByTeam(teamRed);
lines[2].spawnMinionsByTeam(teamBlue);
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


var keysPressed = [];
function processUserInput() {
	console.table(keysPressed);
	let aPressedCounter = keysPressed.filter((key) => key == "a");
	if (aPressedCounter.length > 0) {
	}
}


for (let m of globalMinions) {
	m.render();
}

function updateState() {
	removeDeadMinions();
	globalMinions.sort((a, b) => b.movePriority - a.movePriority);

	console.table(globalMinions);

	for (let m of globalMinions) {
		m.updateState();
	}

	for (let m of globalMinions) {
		m.absorbAttack();
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


