import { getDimension, getPosition } from './utils/utils.js';
import { LEFT_MOUSE } from './constants/constants.js';
// import Events from 'events.js';
import Marker from './marker.js';
const defaultLayoutOptions = {};
const defaultMarkerOptions = {};
const VALID_EVENTS = ['engaged', 'disengaged', 'moved', 'resized', 'removed'];
export default class Layout {
	/**
	 * Set `markerOptions`, `markerOptions` is an object that contains information
	 * that is used to configure a marker when the user adds it to the layout."
	 * @param {*} markerOptions
	 */
	setMarkerOptions(markerOptions) {
		this.markerOptions = Object.assign({}, defaultMarkerOptions, markerOptions);
	}
	setLayoutOptions(layoutOptions) {
		this.layoutOptions = Object.assign({}, defaultLayoutOptions, layoutOptions);
	}
	constructor(layout, markers = [], layoutOptions = {}, markerOptions = {}) {
		this.markers = [];
		this.layout = layout;
		this.registeredEvents = {};
		this.setLayoutOptions(layoutOptions);
		this.setMarkerOptions(markerOptions);
		if (markers.length > 0) {
			this.addMakers(...markers);
		}
		this.start();
	}
	updateMarker(marker) {}
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
		return new Marker(marker);
	}
	emitEvent(eventName, eventData) {
		if (this.registeredEvents[eventName]) {
			this.registeredEvents[eventName](eventData);
		}
	}
	engage(e) {
		const { which: button, pageX, pageY } = e;
		if (button == LEFT_MOUSE) {
			this.events = {};
			const layoutPosition = this.getLayoutPosition();
			const left = pageX - layoutPosition.x; // pageX = clientX + window.scrollX
			const top = pageY - layoutPosition.y; // pageY = clientY + window.scrollY
			this.currentMarker = this.createMarker({ x: left, y: top });
			this.addMarker(this.currentMarker);
			this.anchorPoint = { x: left, y: top };

			this.disengageController = new AbortController();
			document.addEventListener('mousemove', this.move.bind(this), {
				signal: this.disengageController.signal,
			});
			document.addEventListener('mouseup', this.disengage.bind(this), {
				signal: this.disengageController.signal,
			});
			console.log(this.events);
			this.emitEvent('engaged', { type: 'engaged', left, top });
		}
	}
	addMarkers(...markers) {
		markers.forEach((marker) => {
			this.addMarker(marker);
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
			this.currentMarker = null;
		}
	}
}
