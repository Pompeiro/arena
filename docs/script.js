const DEBUG_MODE = true;

const svgLayer0 = document.getElementById("layer-0");
const svgLayer1 = document.getElementById("layer-1");
const svgLayer2 = document.getElementById("layer-2");

const COLUMNS_IN_LINE = 3;

const TEAM_RED = "red";
const TEAM_BLUE = "blue";
const TEAM_RED_MINION_COLOR = "rgb(216, 167, 177)";
const TEAM_RED_TOWER_COLOR = "rgb(236, 167, 177)";
const TEAM_BLUE_MINION_COLOR = "rgb(176, 196, 222)";
const TEAM_BLUE_TOWER_COLOR = "rgb(176, 196, 242)";


const redTeamColors = [TEAM_RED_MINION_COLOR, TEAM_RED_TOWER_COLOR];
const blueTeamColors = [TEAM_BLUE_MINION_COLOR, TEAM_BLUE_TOWER_COLOR];

var globalAllAttackableObjects = [];
var globalMinions = [];
var globalTowers = [];
var globalDebugCircles = [];
var globalDebugLines = [];

function removeDeadMinions() {

	let previousLength = globalMinions.length;
	globalMinions = globalMinions.filter((minion) => minion.stats.hp > 0);
	if (previousLength < globalMinions.length) {
		console.log("Removed minions count:", previousLength - globalMinions.length);
	}
}


function removeDebugArtifacts() {
	if (DEBUG_MODE == false) {
		return null;
	}

	for (let d of globalDebugCircles) {
		d.remove();
	}

	for (let d of globalDebugLines) {
		d.remove();
	}

	globalDebugCircles = [];
	globalDebugLines = [];

}

const debugCall = document.getElementById("debugCall");
const debugInfo = document.getElementById("debugInfo");
const debugReturn = document.getElementById("debugReturn");
/**
 * @function get possible swap columns
 * @param {number} column
 * @param {number} lineOffset 
 * @returns {number[]} swapColumns 
 */
function getSwapColumns(column, lineOffset) {
	let swapColumns = [];
	switch ((column - lineOffset) % 3) {
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
/**
 * @function as forward rectangle is occupied by same team, try to swap column
 * @param {number} row
 * @param {number} column
 * @param {number} direction
 * @param {number} lineOffset 
 * @returns {Point} point
 */
function swapColumn(row, column, direction, lineOffset) {
	console.log("Checking remaining columns in width 3 line");

	let currentRectangle = grid[row][column];
	let targetRow = row + direction;
	for (let i of getSwapColumns(column, lineOffset)) {
		if (grid[targetRow][column + i].getOccupiedBy() == "none") {
			let targetRectangle = grid[targetRow][column + 1];
			console.log("Found free column, pushing minion forward");
			if (DEBUG_MODE == true) {
				debugCall.textContent = `swapColumn called with row: ${row}, column: ${column}, direction: ${direction}`;
				debugInfo.textContent = `targetRow: ${targetRow}, target column: ${column + i}, current i: ${i}`;

				let globalDebugLine = new TargetLine(currentRectangle.xCenter, currentRectangle.yCenter, targetRectangle.xCenter, targetRectangle.yCenter, `debugline${customIdIncrement()}`, svgLayer0);
				globalDebugLine.draw();
				globalDebugLines.push(globalDebugLine);
			}
			return { row: targetRow, column: column + i };
		}
	}

	console.error("Cant move forward, forward row is occupied");
	return { row: row, column: column };
}

/**
 * Row and Column together.
 * @typedef {Object} Point
 * @property {number} row
 * @property {number} column
 */

const point = { row: 50, column: 50 }

/**
	* Moves rectangle forward.
	* @function
	* @param {number} row
	* @param {number} column
	* @param {number} direction
	* @param {string} team
	* @param {number} lineOffset 
	* @returns {Point} point
	*/
function move(row, column, direction, team, lineOffset) {
	let currentRectangle = grid[row][column];
	let targetRow = row + direction;

	if (targetRow > grid.length - 1 || targetRow < 0) {
		console.error("Grid Border has been reached!");
		return { row: row, column: column };
	}
	let targetRectangle = grid[targetRow][column];

	if (DEBUG_MODE == true) {
		debugCall.textContent = `Move called with row: ${row}, column: ${column}, direction: ${direction}`;
		debugInfo.textContent = `targetRow: ${targetRow}, targetRow  > grid.length - 1: ${targetRow > grid.length - 1}, targetRow < 0: ${targetRow < 0}`;
		let globalDebugCircle = new Circle(currentRectangle.xCenter, currentRectangle.yCenter, 30);
		globalDebugCircle.drawBorder();
		globalDebugCircles.push(globalDebugCircles);
		let globalDebugLine = new TargetLine(currentRectangle.xCenter, currentRectangle.yCenter, targetRectangle.xCenter, targetRectangle.yCenter, `debugline${customIdIncrement()}`, svgLayer0, color = "#CEDDDD")
		globalDebugLine.draw();
		globalDebugLines.push(globalDebugLine);
	}

	if (grid[targetRow][column].getOccupiedBy() == "none") {
		return { row: targetRow, column: column };
	}
	else {
		if (grid[targetRow][column].getOccupiedBy() == team) {
			return swapColumn(row, column, direction, lineOffset);
		}
	}
}


class Rectangle {
	constructor(x, y, width, height, svgLayer = svgLayer0, color = "#8CA8B8", strokeWidth = 4, strokeColor = "#D6CFC7", element = document.createElementNS("http://www.w3.org/2000/svg", "rect")) {
		this.svgLayer = svgLayer;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.xCenter = this.x + (this.width / 2)
		this.yCenter = this.y + (this.height / 2)
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
		textElement.id = `text - ${this.x}${this.y} `;
		textElement.setAttribute("x", this.x + 20);
		textElement.setAttribute("y", this.y + 20);
		textElement.style.fontSize = 15;
		textElement.style.fontWeight = 400;
		textElement.innerHTML = text;
		this.svgLayer.appendChild(textElement);
	}
	clearText() {
		let text = document.getElementById(`text - ${this.x}${this.y} `);
		if (text != null) {
			this.svgLayer.removeChild(text);

		}
	}
}

class TargetLine {
	constructor(x1, y1, x2, y2, customId, svgLayer = svgLayer0, color = "#CEDDE3", element = document.createElementNS("http://www.w3.org/2000/svg", "line")) {
		this.svgLayer = svgLayer;
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
		this.customId = `targetLine - ${customId} `;
		this.color = color;
		this.element = element;

		this.element.setAttribute("x1", x1);
		this.element.setAttribute("y1", y1);
		this.element.setAttribute("x2", x2);
		this.element.setAttribute("y2", y2);
		this.element.style.strokeWidth = 10;

		this.element.style.stroke = "none";
		this.element.id = this.customId;

		document.addEventListener("keypress", (k) => {
			if (k.key == "r") {
				if (this.element.style.stroke == "none") {
					this.element.style.stroke = this.color;
				}
				else {
					this.element.style.stroke = "none";
				}
			}
		});

		this.svgLayer.appendChild(this.element);
	}

	draw() {
		this.element.style.stroke = this.color;
	}

	remove() {
		let line = document.getElementById(this.customId);
		if (line != null) {
			this.svgLayer.removeChild(line);
		}
	}
}

class Circle {
	constructor(cx, cy, r, svgLayer = svgLayer0, color = "#C1B7A4", element = document.createElementNS("http://www.w3.org/2000/svg", "circle")) {
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
		this.element.style.strokeWidth = 10;
	}

	remove() {
		this.svgLayer.removeChild(this.element);
	}

}


class TeamData {
	constructor(color, towerColor, direction, minionSpawnRow, towerSpawnRow, team, enemyTeam) {
		this.color = color;
		this.towerColor = towerColor;
		this.direction = direction;
		this.minionSpawnRow = minionSpawnRow;
		this.towerSpawnRow = towerSpawnRow;
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

	spawnTowerByTeam(team) {
		team.spawnTowerByLine(this);
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
	return `${customId} `;
}


class Minion {
	previousRow = 0;
	movePriorityModifier = 10;
	targetRow = null;
	targetColumn = null;
	customId = customIdIncrement();
	movePriority = 0;
	attackToAbsorb = 0;
	targetLine = null;
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
		this.targetColumn = null;
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
				targets.push(globalAllAttackableObjects.find((x) => x.customId == targetId));
			}
		}
		targets.sort((a, b) => (b.maxHp / b.stats.hp + 1 / (b.column + 1) / 100) - (a.maxHp / a.stats.hp + 1 / (a.column + 1) / 100));
		targets[0].attackToAbsorb = targets[0].attackToAbsorb + this.stats.attack;
		this.targetColumn = targets[0].column;
		let currentRectangle = grid[this.row][this.column];
		let targetRectangle = grid[this.targetRow][this.targetColumn];
		this.targetLine = new TargetLine(currentRectangle.xCenter, currentRectangle.yCenter, targetRectangle.xCenter, targetRectangle.yCenter, this.customId, svgLayer0);
	}
	/**
		* @function sets row and column by Point object, sets previousRow and previousColumn
		* @param {Point} point
		*/
	setRowAndColumn(point) {
		this.previousRow = this.row;
		this.previousColumn = this.column;
		this.row = point.row;
		this.column = point.column;
	}
	getSwapColumns() {
		let swapColumns = [];
		switch ((this.column - this.lineOffset) % 3) {
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
				this.swapColumn();
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
		if (this.targetLine != null) {
			this.targetLine.remove();
			this.targetLine = null;
		}
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

	render(color = this.color, text = `hp:${this.stats.hp} `) {
		if (this.targetRow != null) {
			grid[this.row][this.column].clearText();
			grid[this.row][this.column].addText(text);
			return null;
		}
		grid[this.previousRow][this.previousColumn].clear();
		grid[this.previousRow][this.previousColumn].removeCustomId();
		if (this.targetLine != null) {
			this.targetLine.remove();
			this.targetLine = null;
		}
		grid[this.row][this.column].draw(color);
		grid[this.row][this.column].addCustomId(this.customId);
		grid[this.row][this.column].clearText();
		grid[this.row][this.column].addText(text);
	}

	clear() {
		grid[this.row][this.column].clear();
		grid[this.row][this.column].removeCustomId();
		grid[this.row][this.column].clearText();
		if (this.targetLine != null) {
			this.targetLine.remove();
			this.targetLine = null;
		}
	}

}

class Tower {
	targetRow = null;
	targetColumn = null;
	customId = customIdIncrement();
	attackToAbsorb = 0;
	targetLine = null;
	constructor(row, column, direction, team, enemyTeam, color, stats = new Stats(1000, 50, 4)) {
		this.row = row;
		this.column = column;
		this.direction = direction;
		this.team = team;
		this.enemyTeam = enemyTeam;
		this.color = color;
		this.stats = stats;
	}


	setTargetRow() {
		this.targetRow = null;
		this.targetColumn = null;
		let minimumRange = 1;
		for (let i = minimumRange; i <= this.stats.range; i++) {
			if (this.row + (i * this.direction) > grid.length - 1 || this.row + (i * this.direction) < 0) {
				//turn off searching outside grid
				return this.targetRow;
			}
			for (let col of [-1, 1]) {
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
		for (let col of [-1, 0, 1]) {
			if (grid[this.targetRow][this.column + col].getOccupiedBy() == this.enemyTeam) {
				let targetId = grid[this.targetRow][this.column + col].getCustomId();
				targets.push(globalAllAttackableObjects.find((x) => x.customId == targetId));
			}
		}
		targets.sort((a, b) => (b.maxHp / b.stats.hp + 1 / (b.column + 1) / 100) - (a.maxHp / a.stats.hp + 1 / (a.column + 1) / 100));
		targets[0].attackToAbsorb = targets[0].attackToAbsorb + this.stats.attack;
		this.targetColumn = targets[0].column;
		let currentRectangle = grid[this.row][this.column];
		let targetRectangle = grid[this.targetRow][this.targetColumn];
		this.targetLine = new TargetLine(currentRectangle.xCenter, currentRectangle.yCenter, targetRectangle.xCenter, targetRectangle.yCenter, this.customId, svgLayer0);
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
		console.log("Tower updateState");
		if (this.targetLine != null) {
			this.targetLine.remove();
			this.targetLine = null;
		}
		if (this.setTargetRow() != null) {
			this.attackTargetRow();
		}
	}

	render(text = `hp:${this.stats.hp} `) {
		if (this.targetRow != null) {
			grid[this.row][this.column].clearText();
			grid[this.row][this.column].addText(text);
			return null;
		}
		if (this.targetLine != null) {
			this.targetLine.remove();
			this.targetLine = null;
		}

		grid[this.row][this.column].draw(this.color);
		grid[this.row][this.column].addCustomId(this.customId);
		grid[this.row][this.column].clearText();
		grid[this.row][this.column].addText(text);
	}

	clear() {
		grid[this.row][this.column].clear();
		grid[this.row][this.column].removeCustomId();
		grid[this.row][this.column].clearText();
		if (this.targetLine != null) {
			this.targetLine.remove();
			this.targetLine = null;
		}
	}
}

class Team {
	constructor(teamData) {
		this.teamData = teamData;
	}

	spawnMinions(amount) {
		for (let i = 0; i < amount; i++) {
			globalMinions.push(new Minion(this.teamData.minionSpawnRow, i, this.teamData.direction, this.teamData.team, this.teamData.enemyTeam, this.teamData.color, 0));
			console.log("Team:", this.teamData.color, "Spawned minion, minions:", globalMinions);
		}
	}

	spawnMinionsByRow(row, amount) {
		for (let i = 0; i < amount; i++) {
			globalMinions.push(new Minion(row, i, this.teamData.direction, this.teamData.team, this.teamData.enemyTeam, this.teamData.color, 0));
			console.log("Team:", this.teamData.color, "Spawned minion, minions:", globalMinions);
		}
	}

	spawnMinionsByLine(line, amount = 3) {
		for (let i = 0; i < amount; i++) {
			let spawnedMinion = new Minion(this.teamData.minionSpawnRow, line.columnStartingPoint + i, this.teamData.direction, this.teamData.team, this.teamData.enemyTeam, this.teamData.color, line.columnStartingPoint);
			globalMinions.push(spawnedMinion);
			console.log("Team:", this.teamData.color, "Spawned minion, minions:", globalMinions);
		}
	}

	spawnTowerByLine(line) {
		let spawnedTower = new Tower(this.teamData.towerSpawnRow, line.columnStartingPoint + 1, this.teamData.direction, this.teamData.team, this.teamData.enemyTeam, this.teamData.towerColor);
		globalTowers.push(spawnedTower);
		console.log("Team:", this.teamData.color, "Spawned tower");
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
let teamRedData = new TeamData(TEAM_RED_MINION_COLOR, TEAM_RED_TOWER_COLOR, 1, 1, 0, TEAM_RED, TEAM_BLUE);
let teamBlueData = new TeamData(TEAM_BLUE_MINION_COLOR, TEAM_BLUE_TOWER_COLOR, -1, grid.length - 1 - 1, grid.length - 1 - 0, TEAM_BLUE, TEAM_RED);

let teamRed = new Team(teamRedData)
teamRed.spawnMinions(1);

let teamBlue = new Team(teamBlueData)

teamBlue.spawnMinionsByRow(3, 2);
teamBlue.spawnMinionsByRow(4, 3);

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

for (let line of lines) {
	line.spawnTowerByTeam(teamRed);
	line.spawnTowerByTeam(teamBlue);
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
for (let t of globalTowers) {
	t.render();
}

function updateState() {
	removeDeadMinions();
	globalMinions.sort((a, b) => b.movePriority - a.movePriority);
	globalAllAttackableObjects.push(...globalMinions, ...globalTowers)

	console.table(globalMinions);
	for (let m of globalMinions) {
		move(m.row, m.column, m.direction, m.team, m.lineOffset)
	}

	for (let o of globalAllAttackableObjects) {
		o.updateState();
	}

	for (let o of globalAllAttackableObjects) {
		o.absorbAttack();
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
const helpBase = "Press ctrl to trigger game loop, R to toggle target"
help.textContent = `${helpBase} list of keys pressed: ${keysPressed} `
document.addEventListener("keydown", (k) => {
	if (k.key == "Control") {
		gameLoop();
		keysPressed = [];
		help.textContent = `${helpBase} list of keys pressed: ${keysPressed} `
	}
	else {
		keysPressed.push(k.key);
		help.textContent = `${helpBase} list of keys pressed: ${keysPressed} `
	}
});


