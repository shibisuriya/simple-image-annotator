export default class Marker {
	/**
	 * Create a drag-select marker.
	 * @param {*} x X coordinate of the drag-select marker.
	 * @param {*} y Y coordinate of the drag-select marker.
	 */
	constructor({ x, y, width = 0, height = 0 }) {
		this.marker = document.createElement('div');
		this.marker.style.position = 'absolute';
		this.marker.style.left = `${x}px`;
		this.marker.style.top = `${y}px`;
		if (width) {
			this.marker.style.width = `${width}px`;
		}
		if (height) {
			this.marker.style.height = `${height}px`;
		}
		this.marker.style.border = '5px solid black';
		this.marker.style.boxSizing = 'border-box';
	}
	/**
	 * Returns the HTML element of the drag select marker.
	 * @returns {HTMLElement}
	 */
	getElement() {
		return this.marker;
	}
	setX(x) {
		this.marker.style.left = `${x}px`;
	}
	setY(y) {
		this.marker.style.top = `${y}px`;
	}
	setWidth(width) {
		this.marker.style.width = `${width}px`;
	}
	setHeight(height) {
		this.marker.style.height = `${height}px`;
	}
	getWidth() {
		return this.marker.offsetWidth;
	}
	getHeight() {
		return this.marker.offsetHeight;
	}
	getX() {
		return this.marker.offsetLeft;
	}
	getY() {
		return this.marker.offsetTop;
	}
	getDimension() {
		return {
			width: this.getWidth(),
			height: this.getHeight(),
		};
	}
	getPosition() {
		return {
			x: this.getX(),
			y: this.getY(),
		};
	}
}
