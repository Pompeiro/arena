const svg = document.getElementById("arena");

class Rectangle {
	constructor(x, y, width, height, color = "#8CA8B8", strokeWidth = 4, strokeColor = "#D6CFC7", element = document.createElementNS("http://www.w3.org/2000/svg", "rect")) {
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
		this.element.setAttribute("fill", "#eeeeee");

		this.element.addEventListener("mouseover", () => {
			this.element.setAttribute("fill", "#8CA8B8");
			console.log("hover over");
		});

		this.element.addEventListener("mouseout", () => {
			this.element.setAttribute("fill", "#eeeeee");
		});

		svg.appendChild(this.element);

	}
	draw(color = this.color) {
		this.element.setAttribute("fill", color);
		svg.appendChild(this.element);
	}
	drawBorder() {
		this.element.setAttribute("stroke", "#D6CFC7");
		this.element.setAttribute("stroke-width", this.strokeWidth);
	}

}

class Circle {
	constructor(cx, cy, r, color = "#C1B7A4", element = document.createElementNS("http://www.w3.org/2000/svg", "circle")) {
		this.cx = cx;
		this.cy = cy;
		this.r = r;
		this.color = color;
		this.element = element;

		this.element.setAttribute("cx", cx);
		this.element.setAttribute("cy", cy);
		this.element.setAttribute("r", r);
		this.element.setAttribute("fill", "#eeeeee");

		this.element.addEventListener("mouseover", () => {
			this.element.setAttribute("fill", "#C8C4D6");
			console.log("hover over circle");
		});

		this.element.addEventListener("mouseout", () => {
			this.element.setAttribute("fill", "#eeeeee");
		});
		document.addEventListener("keydown", (k) => {
			if (k.key == "Shift") {
				this.element.setAttribute("fill", "#C8C4D6");
				console.log("shift keydown");
			}
		});

		document.addEventListener("keyup", (k) => {
			if (k.key == "Shift") {
				this.element.setAttribute("fill", "#eeeeee");

			}
		});
		svg.appendChild(this.element);

	}
	draw(color = this.color) {
		this.element.setAttribute("fill", color);
		svg.appendChild(this.element);
	}
	drawBorder() {
		this.element.setAttribute("stroke", "#D6CFC7");
		this.element.setAttribute("stroke-width", this.strokeWidth);
	}

}

const arenaWidth = 800;
const arenaHeight = 600;
const gridRowCount = 8;
const gridColCount = 12;
const grid = [];
const gridRows = [];
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

grid[2][3].draw();
grid[5][5].draw();

const tower = grid[1][6]

const towerCircle = new Circle(cx = tower.x + gridRectangleWidth / 2, cy = tower.y + gridRectangleHeight / 2, r = gridRectangleWidth / 2 * 3)
towerCircle.draw()

tower.draw("#B0C4DE")

const tower2 = grid[7][6]

const tower2Circle = new Circle(cx = tower2.x + gridRectangleWidth / 2, cy = tower2.y + gridRectangleHeight / 2, r = gridRectangleWidth / 2 * 3)
tower2Circle.draw()

tower2.draw("#B0C4DE")
