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
		// this.addSlot(this.options.slot);
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
		const getElementWidth = () => {
			return -element.offsetWidth + offsetX;
		};
		switch (direction) {
			case 'e':
				element.style.right = '0px';
				element.style.top = '50%';
				element.style.transform = 'translateY(-50%)';
				break;
			case 'w':
				element.style.right = `${getElementWidth()}`;
				element.style.top = '50%';
				element.style.transform = 'translateY(-50%)';
				break;
			case 'n':
				element.style.top = `${offsetX}`;
				element.style.left = '50%';
				element.style.transform = 'translateX(-50%)';
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
