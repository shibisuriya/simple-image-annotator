import { getDimension, getPosition, isEmpty } from './utils/utils.js';
import Handle from './handle.js';
const defaultOptions = {};
export default class Marker {
	/**
	 * Create a drag-select marker.
	 * @param {*} x X coordinate of the drag-select marker.
	 * @param {*} y Y coordinate of the drag-select marker.
	 */
	constructor({ x, y, width = 0, height = 0, options = {} }) {
		this.setMarkerOptions(options);
		this.handles = [];
		this.element = this.createElement({
			x,
			y,
			width,
			height,
			styles: this.options.styles,
			handles: this.options.handles,
		});
		if (this.options.slot) {
			this.addSlot(this.options.slot);
		}
		// The marker has been inserted into the layout, now wait for the resize / move commands.
	}
	setMarkerOptions(options) {
		this.options = Object.assign({}, defaultOptions, options);
	}
	createElement({ x, y, width, height, styles = {}, handles }) {
		const element = document.createElement('div');
		element.draggable = false;
		Object.assign(
			element.style,
			{
				left: `${x}px`,
				top: `${y}px`,
				width: `${width}px`,
				height: `${height}px`,
				position: 'absolute',
				boxSizing: 'border-box',
			},
			styles,
		);
		this.addHandles({ markerElement: element, handles });
		return element;
	}
	addSlot(slot) {
		const { element, direction, offsetX, offsetY } = slot;
		element.style.position = 'absolute';
		const getHorizontalPosition = () => {
			return `${-element.offsetWidth - parseFloat(offsetX)}px`;
		};
		const getVerticalPosition = () => {
			return `${-element.offsetHeight - parseFloat(offsetY)}px`;
		};
		console.log(getVerticalPosition());
		switch (direction) {
			case 'e':
				Object.assign(element.style, {
					right: getHorizontalPosition(),
					top: '50%',
					transform: 'translateY(-50%)',
				});
				break;
			case 'w':
				Object.assign(element.style, {
					left: getHorizontalPosition(),
					top: '50%',
					transform: 'translateY(-50%)',
				});
				break;
			case 'n':
				Object.assign(element.style, {
					top: getVerticalPosition(),
					left: '50%',
					transform: 'translateX(-50%)',
				});

				break;
			case 's':
				Object.assign(element.style, {
					bottom: getVerticalPosition(),
					left: '50%',
					transform: 'translateX(-50%)',
				});
				break;
			case 'ne':
				Object.assign(element.style, {
					right: getHorizontalPosition(),
					top: getVerticalPosition(),
				});
				break;
			case 'se':
				Object.assign(element.style, {
					bottom: getVerticalPosition(),
					right: getHorizontalPosition(),
				});
				break;
			case 'sw':
				Object.assign(element.style, {
					bottom: getVerticalPosition(),
					left: getHorizontalPosition(),
				});
				break;
			case 'nw':
				Object.assign(element.style, {
					left: getHorizontalPosition(),
					top: getVerticalPosition(),
				});
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
	addHandles({ markerElement, handles }) {
		const { directions, ...options } = handles;
		directions.forEach((direction) => {
			const handle = new Handle({
				direction,
				...options,
				helpers: {
					getMarkerHeight: this.getHeight.bind(this),
					getMarkerWidth: this.getWidth.bind(this),
					getMarkerPosition: this.getMarkerPosition.bind(this),
					getMarkerDimension: this.getMarkerDimension.bind(this),
					setMarkerHeight: this.setHeight.bind(this),
					setMarkerWidth: this.setWidth.bind(this),
					setMarkerY: this.setY.bind(this),
					setMarkerX: this.setX.bind(this),
					getMarkerY: this.getY.bind(this),
					getMarkerX: this.getX.bind(this),
					getLayoutDimension: this.getLayoutDimension.bind(this),
					getLayoutPosition: this.getLayoutPosition.bind(this),
				},
			});
			this.handles.push(handle);
			markerElement.appendChild(handle.getHandleElement());
		});
	}
	getMarkerDimension() {
		return getDimension(this.getMarkerElement());
	}
	getMarkerPosition() {
		return getPosition(this.getMarkerElement());
	}
	/**
	 * Returns the HTML element of the drag select marker.
	 * @returns {HTMLElement}
	 */
	getElement() {
		return this.element;
	}
	setMoveCursor() {
		this.getMarkerElement().style.cursor = 'move';
	}
	getMarkerElement() {
		return this.getElement();
	}
	setX(x) {
		this.getMarkerElement().style.left = `${x}px`;
	}
	setY(y) {
		this.getMarkerElement().style.top = `${y}px`;
	}
	setWidth(width) {
		this.getMarkerElement().style.width = `${width}px`;
	}
	setHeight(height) {
		this.getMarkerElement().style.height = `${height}px`;
	}
	getWidth() {
		return this.getMarkerElement().offsetWidth;
	}
	getHeight() {
		return this.getMarkerElement().offsetHeight;
	}
	getX() {
		return this.getMarkerElement().offsetLeft;
	}
	getY() {
		return this.getMarkerElement().offsetTop;
	}
	mouseUp() {
		this.disengageController.abort();
	}
	mouseMove() {
		const { pageX, pageY } = event;
		const { offsetLeft, offsetTop } = this.getMarkerElement();
		const { width: containerWidth, height: containerHeight } = this.getLayoutDimension();
		const { width: markerWidth, height: markerHeight } = getDimension(this.getMarkerElement());

		// Horizontal move
		const left = offsetLeft + pageX - this.anchorPoint.x;
		const maxLeft = containerWidth - markerWidth;
		if (left >= 0 && left <= maxLeft) {
			this.setX(left);
			this.anchorPoint.x = pageX;
		} else if (left < 0) {
			this.setX(0);
		} else if (left > maxLeft) {
			this.setX(maxLeft);
		}

		// Vertical move
		const top = offsetTop + pageY - this.anchorPoint.y;
		const maxTop = containerHeight - markerHeight;
		if (top >= 0 && top <= maxTop) {
			this.setY(top);
			this.anchorPoint.y = pageY;
		} else if (top < 0) {
			this.setY(0);
		} else if (top > maxTop) {
			this.setY(maxTop);
		}
	}
	inserted() {
		this.setMoveCursor();
		this.start();
	}
	// mouseEnter(e) {
	// 	this.showHandles();
	// 	console.log(e);
	// }
	// mouseLeave(e) {
	// 	console.log(e);
	// 	this.hideHandles();
	// }
	start() {
		this.engageController = new AbortController();
		this.getMarkerElement().addEventListener('mousedown', this.mouseDown.bind(this), {
			signal: this.engageController.signal,
		});
		// this.marker.addEventListener('mouseenter', this.mouseEnter.bind(this), {
		// 	signal: this.engageController.signal,
		// });
		// this.marker.addEventListener('mouseleave', this.mouseLeave.bind(this), {
		// 	signal: this.engageController.signal,
		// });
		// this.getMarkerElement().addEventListener('click', this.showHideHandles.bind(this));
	}
	// showHideHandles() {
	// 	if (this.areHandlesVisible) {
	// 		this.hideHandles();
	// 	} else {
	// 		this.showHandles();
	// 	}
	// }
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
