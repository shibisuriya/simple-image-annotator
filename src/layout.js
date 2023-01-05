import { getDimension, getPosition, isEmpty } from './utils/utils.js';
import { LEFT_MOUSE } from './constants/constants.js';
// import Events from 'events.js';
import Marker from './marker.js';
const defaultLayoutOptions = {};
const defaultMarkerOptions = {};
const VALID_EVENTS = ['engaged', 'disengaged', 'moved', 'resized', 'removed'];
export default class Layout {
	/**
	 * Set `markerOptions`, `markerOptions` is an object that contains information (such as borders, shapes, etc.)
	 * that is used to construct a marker when the user adds it to the layout. `setMarkerOptions()` won't affect
	 * existing markers but will change the attributes of the markers which will be added to the layout in the future.
	 * @param {*} markerOptions
	 */
	setMarkerOptions(markerOptions) {
		this.markerOptions = Object.assign({}, defaultMarkerOptions, markerOptions);
	}
	setLayoutOptions(layoutOptions) {
		this.layoutOptions = Object.assign({}, defaultLayoutOptions, layoutOptions);
	}
	constructor({ layout, markers: preExistingMarkers = [], layoutOptions = {}, markerOptions = {} } = {}) {
		this.layout = layout;
		this.markers = [];
		this.makeLayoutRelative();
		this.registeredEvents = {};
		this.setLayoutOptions(layoutOptions);
		this.setMarkerOptions(markerOptions);
		if (preExistingMarkers.length > 0) {
			this.addPreExistingMarkers(...preExistingMarkers);
		}
		this.start();
	}
	makeLayoutRelative() {
		// All the markers are placed relative to layout's position.
		this.oldLayoutPosition = this.layout.style.position || 'static';
		this.layout.style.position = 'relative';
	}
	resetLayoutPosition() {
		this.layout.style.position = this.oldLayoutPosition;
	}
	destroy() {
		this.resetLayoutPosition();
	}
	updateMarker({ id, options }) {}
	getMarkers() {
		return this.markers.map((marker) => {
			return {
				...marker.getDimension(),
				...marker.getPosition(),
			};
		});
	}
	getLayoutPosition() {
		return getPosition(this.layout);
	}
	getLayoutDimension() {
		return getDimension(this.layout);
	}
	/**
	 * Stop listening for user interaction. Stop listening for events (such as left mouse button down) on layout to add `drag-area-marker` to the layout.
	 */
	stop() {
		this.engageController.abort();
	}
	/**
	 * Start listening for user interaction. Start listening for events (such as left mouse button up) on layout to add `drag-area-marker` to the layout.
	 */
	start() {
		this.engageController = new AbortController();
		this.layout.addEventListener('mousedown', this.engage.bind(this), { signal: this.engageController.signal });
	}
	/**
	 *
	 * @param {Array.<Object>} markers - An array of markers.
	 */
	createMarker(marker) {
		Marker.prototype.getLayoutDimension = this.getLayoutDimension.bind(this);
		Marker.prototype.getLayoutPosition = this.getLayoutPosition.bind(this);
		return new Marker(marker);
	}
	emitEvent(eventName, eventData) {
		if (this.registeredEvents[eventName]) {
			this.registeredEvents[eventName](eventData);
		}
	}
	setCursor() {
		document.querySelector('body').style.cursor = 'crosshair';
	}
	resetCursor() {
		document.querySelector('body').style.cursor = '';
	}
	engage(e) {
		// e.stopPropagation();
		const { which: button, pageX, pageY } = e;
		if (button == LEFT_MOUSE) {
			this.setCursor();
			const layoutPosition = this.getLayoutPosition();
			const x = pageX - layoutPosition.x; // pageX = clientX + window.scrollX
			const y = pageY - layoutPosition.y; // pageY = clientY + window.scrollY
			this.currentMarker = this.createMarker({
				x,
				y,
				options: this.markerOptions,
			});
			this.addMarker(this.currentMarker);
			this.anchorPoint = { x, y };

			this.disengageController = new AbortController();
			document.addEventListener('mousemove', this.move.bind(this), {
				signal: this.disengageController.signal,
			});
			document.addEventListener('mouseup', this.disengage.bind(this), {
				signal: this.disengageController.signal,
			});
			this.emitEvent('engaged', { type: 'engaged', x, y });
		}
	}
	addPreExistingMarkers(...markers) {
		markers.forEach((marker) => {
			const newMarker = this.createMarker(marker);
			this.addMarker(newMarker);
			newMarker.inserted();
		});
	}
	addMarker(marker) {
		this.markers.push(marker);
		this.layout.appendChild(marker.getElement());
	}
	on(eventName, func) {
		if (VALID_EVENTS.includes(eventName.trim())) {
			this.registeredEvents[eventName.trim()] = func;
		} else {
			console.error(`'${eventName.trim()}' is an invalid event.`);
		}
	}
	/**
	 *
	 * @returns {Object}
	 */
	save() {
		return {
			markers: this.getMarkers(),
			layout: {
				dimension: this.getLayoutDimension(),
			},
		};
	}
	move(e) {
		const { which: button } = e;
		if (button == LEFT_MOUSE) {
			if (this.currentMarker) {
				const { pageX, pageY } = e; // Position of the mouse pointer in the page (scroll lengths included).
				const layoutPosition = this.getLayoutPosition();
				const layoutDimension = this.getLayoutDimension();
				const left = pageX - layoutPosition.x;
				const top = pageY - layoutPosition.y;
				const { x: anchorX, y: anchorY } = this.anchorPoint;
				if (left <= layoutDimension.width && left >= 0) {
					// Mouse pointer is inside the container element.
					if (left - anchorX >= 0) {
						this.currentMarker.setX(anchorX);
						this.currentMarker.setWidth(left - anchorX);
					} else {
						this.currentMarker.setX(left);
						this.currentMarker.setWidth(anchorX - left);
					}
				} else if (left > layoutDimension.width) {
					// Mouse pointer is to the right of the container element.
					this.currentMarker.setWidth(layoutDimension.width - anchorX);
				} else if (left < 0) {
					// Mouse pointer is to the left of the container element.
					this.currentMarker.setX(0);
					this.currentMarker.setWidth(anchorX);
				}
				if (top <= layoutDimension.height && top >= 0) {
					// Mouse pointer is inside the container element.
					if (top - anchorY >= 0) {
						this.currentMarker.setY(anchorY);
						this.currentMarker.setHeight(top - anchorY);
					} else {
						this.currentMarker.setY(top);
						this.currentMarker.setHeight(anchorY - top);
					}
				} else if (top > layoutDimension.height) {
					// Mouse pointer is below the container element.
					this.currentMarker.setHeight(layoutDimension.height - anchorY);
				} else if (top < 0) {
					// Mouse pointer is above the container element.
					this.currentMarker.setY(0);
					this.currentMarker.setHeight(anchorY);
				}
			}
		}
	}
	disengage(e) {
		const { which: button } = e;
		if (button == LEFT_MOUSE) {
			this.resetCursor();
			this.disengageController.abort();
			this.anchorPoint = {};
			this.emitEvent('disengaged', {
				type: 'disengaged',
				element: this.currentMarker.getElement(),
				x: this.currentMarker.getX(),
				y: this.currentMarker.getY(),
				width: this.currentMarker.getWidth(),
				height: this.currentMarker.getHeight(),
			});
			this.currentMarker.inserted();
			this.currentMarker = null;
		}
	}
}
