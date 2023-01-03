import { getDimension, getPosition, isEmpty } from './utils/utils.js';
import Handle from './handle.js';
const defaultOptions = {
	handles: [
		{
			direction: 'se',
			offset: '-17px',
			shape: 'circle',
			width: '30px',
			height: '500px',
			showWhileInserting: false,
		},
		{
			direction: 'ne',
			offset: '-10px',
			width: '20px',
			height: '20px',
			styles: {
				backgroundColor: 'red',
				border: '1px solid blue',
			},
		},
		{ direction: 'sw', offset: '-5px', width: '20px', height: '20px' },
		{ direction: 'nw', offset: '-5px', width: '20px', height: '20px' },
		{ direction: 'e', offset: '-5px', width: '20px', height: '20px' },
		{ direction: 'w', offset: '-5px', width: '20px', height: '20px' },
		{ direction: 'n', offset: '-5px', width: '20px', height: '20px' },
		{
			direction: 's',
			offsetX: '40%',
			offsetY: '-30px',
			offset: '30px',
			width: '30px',
			height: '30px',
			styles: {
				border: '5px solid white',
			},
		},
	],
	slot: { element: document.getElementById('test-input-box'), direction: 's', offsetX: '-60px', offsetY: '5px' },
	alwaysShowMarkers: true,
	showMarkersOnHover: false,
	showMarkersOnClick: false,
	shape: 'square | circle',
	minWidth: '100px',
	minHeight: '100px',
	maxWidth: '100px',
	maxHeight: '100px',
	boundedByLayout: true,
	styles: {
		border: '3px dotted yellow',
	},
};
export default class Marker {
	/**
	 * Create a drag-select marker.
	 * @param {*} x X coordinate of the drag-select marker.
	 * @param {*} y Y coordinate of the drag-select marker.
	 */
	constructor({ x, y, width = 0, height = 0, options = {} }) {
		this.handles = [];
		this.setMarkerOptions(options);
		this.element = this.createElement({ x, y, width, height, styles: this.options.styles });
		this.addHandles(this.options.handles);
		this.addSlot(this.options.slot);
		// The marker has been inserted into the layout, now wait for the resize / move commands.
	}
	setMarkerOptions(options) {
		this.options = Object.assign({}, defaultOptions, options);
	}
	createElement({ x, y, width, height, styles = {} }) {
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
	addHandles(handles) {
		handles.forEach((options) => {
			const handle = new Handle({
				...options,
				...{
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
				},
			});
			this.handles.push(handle);
			this.getMarkerElement().appendChild(handle.getHandleElement());
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
	getDimension() {
		return {
			width: this.getWidth(),
			height: this.getHeight(),
		};
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
			this.getMarkerElement().style.left = `${left}px`;
			this.anchorPoint.x = pageX;
		} else if (left < 0) {
			this.getMarkerElement().style.left = `${0}px`;
		} else if (left > maxLeft) {
			this.getMarkerElement().style.left = `${maxLeft}px`;
		}

		// Vertical move
		const top = offsetTop + pageY - this.anchorPoint.y;
		const maxTop = containerHeight - markerHeight;
		if (top >= 0 && top <= maxTop) {
			this.getMarkerElement().style.top = `${top}px`;
			this.anchorPoint.y = pageY;
		} else if (top < 0) {
			this.getMarkerElement().style.top = `${0}px`;
		} else if (top > maxTop) {
			this.getMarkerElement().style.top = `${maxTop}px`;
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
		this.getMarkerElement().addEventListener('mousedown', this.mouseDown.bind(this), {
			signal: this.engageController.signal,
		});
		// this.marker.addEventListener('mouseenter', this.mouseEnter.bind(this), {
		// 	signal: this.engageController.signal,
		// });
		// this.marker.addEventListener('mouseleave', this.mouseLeave.bind(this), {
		// 	signal: this.engageController.signal,
		// });
		this.getMarkerElement().addEventListener('click', this.showHideHandles.bind(this));
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
