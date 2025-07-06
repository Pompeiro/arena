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
		this.element.style.display = "none";

		this.element.addEventListener("mouseover", () => {

			this.element.style.display = "";
			this.element.style.fill = "#8CA8B8";
			console.log("hover over");

			this.svgLayer.appendChild(this.element);
		});

		this.element.addEventListener("mouseout", () => {

			this.drawBorder();



		});
		this.svgLayer.appendChild(this.element);
	}

	draw(color = this.color) {
		this.element.style.display = "";

		this.element.style.fill = color;

		this.svgLayer.appendChild(this.element);
	}
	drawBorder() {

		this.element.style.display = "";
		this.element.style.fill = "none";

		this.element.setAttribute("stroke", "#D6CFC7");
		this.element.setAttribute("stroke-width", this.strokeWidth);

		this.svgLayer.appendChild(this.element);

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
		this.element.setAttribute("fill", "#eeeeee");

		this.element.style.display = "none";
		this.element.addEventListener("mouseover", () => {
			this.element.style.display = "";
			this.element.setAttribute("fill", "#C8C4D6");
			console.log("hover over circle");
		});

		this.element.addEventListener("mouseout", () => {
			this.element.style.display = "none";
		});
		document.addEventListener("keydown", (k) => {
			if (k.key == "Shift") {
				this.element.style.display = "";
				this.element.setAttribute("fill", "#C8C4D6");
				console.log("shift keydown");
			}
		});

		document.addEventListener("keyup", (k) => {
			if (k.key == "Shift") {

				this.element.style.display = "none";


			}
		});
		this.svgLayer.appendChild(this.element);

	}
	draw(color = this.color) {
		this.element.style.display = "";

		this.element.style.fill = color;

		this.svgLayer.appendChild(this.element);
	}
	drawBorder() {

		this.element.style.display = "";
		this.element.style.fill = "none";

		this.element.setAttribute("stroke", "#D6CFC7");
		this.element.setAttribute("stroke-width", this.strokeWidth);

		this.svgLayer.appendChild(this.element);

	}

}


class Line {
	lineWidthByRectangleCount = 3;
	lineHeightByRectangleCount = gridRowCount;
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

		this.element.setAttribute("fill", color);

		this.element.style.opacity = 0.5;

		this.element.style.display = "none";

		this.svgLayer.appendChild(this.element);

	}
	draw(color = this.color) {
		this.element.style.display = "";

		this.element.style.fill = color;

		this.svgLayer.appendChild(this.element);
	}
	drawBorder() {

		this.element.style.display = "";
		this.element.style.fill = "none";

		this.element.setAttribute("stroke", "#D6CFC7");
		this.element.setAttribute("stroke-width", this.strokeWidth);

		this.svgLayer.appendChild(this.element);

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

const svgLayer10 = document.getElementById("layer-10");
const svgLayer11 = document.getElementById("layer-11");
const svgLayer12 = document.getElementById("layer-12");
class Rectangle1 {
	constructor(x, y, width, height, svgLayer = svgLayer10, color = "#8CA8B8", strokeWidth = 4, strokeColor = "#D6CFC7", element = document.createElementNS("http://www.w3.org/2000/svg", "rect")) {
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
		this.element.style.display = "none";

		this.svgLayer.appendChild(this.element);

	}
	draw(color = this.color) {
		this.element.style.display = "";

		this.element.style.fill = color;

		this.svgLayer.appendChild(this.element);
	}
	drawBorder() {

		this.element.style.display = "";
		this.element.style.fill = "none";

		this.element.setAttribute("stroke", "#bbbbbb");
		this.element.setAttribute("stroke-width", this.strokeWidth);

		this.svgLayer.appendChild(this.element);

	}

}
const factor = 3;
r1 = new Rectangle1(300, 300, 100 + factor * 50, 100 + 50, svgLayer = svgLayer10);
r1.drawBorder()
r2 = new Rectangle1(300, 300, 100 + factor * 100, 100 + 100, svgLayer = svgLayer11, color = "#C9D6CD");

r3 = new Rectangle1(300, 300, 100 + factor * 150, 100 + 150, svgLayer = svgLayer12, color = "#C9Deee");
r3.drawBorder()
r1.draw()
r3.draw()


