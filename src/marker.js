import { getDimension, isEmpty } from './utils/utils.js';
import Handle from './handle.js';
export default class Marker {
	/**
	 * Create a drag-select marker.
	 * @param {*} x X coordinate of the drag-select marker.
	 * @param {*} y Y coordinate of the drag-select marker.
	 */
	constructor({ x, y, width = 0, height = 0, handles, styles, slot }) {
		console.log(slot);
		this.styles = styles;
		this.handles = [];
		this.areHandlesVisible = false;
		this.marker = document.createElement('div');
		this.marker.draggable = false;
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
		// this.hideHandles();
		this.slot = slot;
		if (!isEmpty(slot)) {
			this.addSlot();
		}
	}
	addSlot() {
		const { element, direction, offsetX, offsetY } = this.slot;
		element.style.position = 'absolute';
		switch (direction) {
			case 'e':
				break;
			case 'w':
				break;
			case 'n':
				break;
			case 's':
				element.style.bottom = '-50px';
				element.style.left = '50%';
				element.style.transform = 'translateX(-50%)';
				break;

			case 'ne':
				break;
			case 'se':
				break;
			case 'sw':
				break;
			case 'nw':
				break;
		}
		this.getMarkerElement().appendChild(element);
	}
	showHandles() {
		console.log('show handles', this.handles);
		this.areHandlesVisible = true;
		this.handles.forEach((handle) => {
			handle.show();
		});
	}
	hideHandles() {
		console.log(this.handles);
		this.areHandlesVisible = false;
		this.handles.forEach((handle) => {
			handle.hide();
		});
	}
	createHandles(handles) {
		handles.forEach((options) => {
			const handle = new Handle(options);
			handle['getMarkerHeight'] = this.getHeight.bind(this);
			handle['getMarkerWidth'] = this.getWidth.bind(this);
			handle['setMarkerHeight'] = this.setHeight.bind(this);
			handle['setMarkerWidth'] = this.setWidth.bind(this);
			handle['setMarkerY'] = this.setY.bind(this);
			handle['setMarkerX'] = this.setX.bind(this);
			handle['getLayoutDimension'] = this.getLayoutDimension.bind(this);
			handle['getLayoutPosition'] = this.getLayoutPosition.bind(this);
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
	mouseEnter(e) {
		this.showHandles();
		console.log(e);
	}
	mouseLeave(e) {
		console.log(e);
		this.hideHandles();
	}
	start() {
		this.engageController = new AbortController();
		this.marker.addEventListener('mousedown', this.mouseDown.bind(this), {
			signal: this.engageController.signal,
		});
		// this.marker.addEventListener('mouseenter', this.mouseEnter.bind(this), {
		// 	signal: this.engageController.signal,
		// });
		// this.marker.addEventListener('mouseleave', this.mouseLeave.bind(this), {
		// 	signal: this.engageController.signal,
		// });
		this.marker.addEventListener('click', this.showHideHandles.bind(this));
	}
	showHideHandles() {
		if (this.areHandlesVisible) {
			this.hideHandles();
		} else {
			this.showHandles();
		}
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
