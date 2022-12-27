import { getDimension } from './utils/utils.js';
import Handle from './handle.js';
export default class Marker {
	/**
	 * Create a drag-select marker.
	 * @param {*} x X coordinate of the drag-select marker.
	 * @param {*} y Y coordinate of the drag-select marker.
	 */
	constructor({ x, y, width = 0, height = 0, handles, styles }) {
		console.log('s', styles);
		this.styles = styles;
		this.handles = [];
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
		Object.assign(this.marker.style, styles);
		this.marker.style.boxSizing = 'border-box';
		this.createHandles(handles);
	}
	createHandles(handles) {
		Handle.prototype.getMarkerHeight = this.getHeight.bind(this);
		Handle.prototype.getMarkerWidth = this.getWidth.bind(this);
		Handle.prototype.setMarkerHeight = this.setHeight.bind(this);
		Handle.prototype.setMarkerWidth = this.setWidth.bind(this);
		Handle.prototype.setMarkerY = this.setY.bind(this);
		Handle.prototype.setMarkerX = this.setX.bind(this);
		Handle.prototype.getLayoutDimension = this.getLayoutDimension.bind(this);
		Handle.prototype.getLayoutPosition = this.getLayoutPosition.bind(this);
		handles.forEach((options) => {
			const handle = new Handle(options);
			this.addHandle(handle);
		});
	}
	getMarkerElement() {
		return this.marker;
	}
	addHandle(handle) {
		this.handles.push(handle);
		this.getMarkerElement().appendChild(handle.getHandleElement());
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

	mouseUp() {
		this.disengageController.abort();
	}
	mouseMove() {
		console.log('Marker is being moved.');
		const { pageX, pageY } = event;
		const { offsetLeft, offsetTop } = this.marker;
		const { width: containerWidth, height: containerHeight } = this.getLayoutDimension();
		const { width: markerWidth, height: markerHeight } = getDimension(this.marker);

		// Horizontal move
		const left = offsetLeft + pageX - this.anchorPoint.x;
		const maxLeft = containerWidth - markerWidth;
		if (left >= 0 && left <= maxLeft) {
			this.marker.style.left = `${left}px`;
			this.anchorPoint.x = pageX;
		} else if (left < 0) {
			this.marker.style.left = `${0}px`;
		} else if (left > maxLeft) {
			this.marker.style.left = `${maxLeft}px`;
		}

		// Vertical move
		const top = offsetTop + pageY - this.anchorPoint.y;
		const maxTop = containerHeight - markerHeight;
		if (top >= 0 && top <= maxTop) {
			this.marker.style.top = `${top}px`;
			this.anchorPoint.y = pageY;
		} else if (top < 0) {
			this.marker.style.top = `${0}px`;
		} else if (top > maxTop) {
			this.marker.style.top = `${maxTop}px`;
		}
	}
	inserted() {
		this.start();
	}
	start() {
		this.engageController = new AbortController();
		this.marker.addEventListener('mousedown', this.mouseDown.bind(this), {
			signal: this.engageController.signal,
		});
	}
	stop() {
		this.engageController.abort();
	}
	mouseDown(e) {
		e.stopPropagation();
		this.anchorPoint = {
			x: e.pageX,
			y: e.pageY,
		};
		this.disengageController = new AbortController();
		document.addEventListener('mousemove', this.mouseMove.bind(this), {
			signal: this.disengageController.signal,
		});
		document.addEventListener('mouseup', this.mouseUp.bind(this), { signal: this.disengageController.signal });
	}
}
