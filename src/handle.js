export default class Handle {
	constructor({ direction, offset, shape, width = '5px', height = '5px', styles }) {
		this.direction = direction;
		this.styles = styles;
		this.offset = offset;
		this.shape = shape;
		if (this.shape == 'circle') {
			this.width = this.height = width;
		} else {
			this.width = width;
			this.height = height;
		}
		this.handle = this.makeHandle(this.direction);
		this.handle.addEventListener('mousedown', this.mouseDown.bind(this));
	}
	hide() {
		this.handle.style.display = 'none';
	}
	show() {
		this.handle.style.display = 'block';
	}
	getHandleElement() {
		return this.handle;
	}

	mouseDown(e) {
		e.stopPropagation();
		this.anchorPoint = {
			x: e.pageX,
			y: e.pageY,
		};
		this.engageController = new AbortController();
		document.addEventListener('mousemove', this.mouseMove().bind(this), {
			signal: this.engageController.signal,
		});
		document.addEventListener('mouseup', this.mouseUp.bind(this), { signal: this.engageController.signal });
	}
	mouseUp() {
		this.engageController.abort();
	}
	se(e) {
		const { pageX, pageY } = e;

		// Vertical move
		const newHeight = this.getMarkerHeight() + pageY - this.anchorPoint.y;
		this.setMarkerHeight(newHeight);
		this.anchorPoint.y = pageY;

		// Horizontal move
		const newWidth = this.getMarkerWidth() + pageX - this.anchorPoint.x;
		this.setMarkerWidth(newWidth);
		this.anchorPoint.x = pageX;
	}
	nw(e) {
		const { pageX, pageY } = e;
		const { x: containerX, y: containerY } = this.getLayoutPosition();

		// Horizontal move
		const newWidth = this.anchorPoint.x - pageX + this.getMarkerWidth();
		this.anchorPoint.x = pageX;
		this.setMarkerX(pageX - containerX);
		this.setMarkerWidth(newWidth);

		// Vertical move
		const newHeight = this.anchorPoint.y - pageY + this.getMarkerHeight();
		this.anchorPoint.y = pageY;
		this.setMarkerY(pageY - containerY);
		this.setMarkerHeight(newHeight);
	}
	sw(e) {
		const { pageY, pageX } = e;

		// Vertical move
		const newHeight = this.getMarkerHeight() + pageY - this.anchorPoint.y;
		this.setMarkerHeight(newHeight);
		this.anchorPoint.y = pageY;

		// Horizontal move

		const newWidth = this.anchorPoint.x - pageX + this.getMarkerWidth();
		this.setMarkerWidth(newWidth);
		this.anchorPoint.x = pageX;
		const { x: containerX } = this.getLayoutPosition();
		this.setMarkerX(pageX - containerX);
	}
	ne(e) {
		const { pageX, pageY } = e;

		// Horizontal move
		this.setMarkerWidth(this.getMarkerWidth() + pageX - this.anchorPoint.x);
		this.anchorPoint.x = pageX;

		// Vertical move
		const newHeight = this.getMarkerHeight() + this.anchorPoint.y - pageY;
		this.setMarkerHeight(newHeight);
		this.anchorPoint.y = pageY;

		const { y: containerY } = this.getLayoutPosition();
		const newY = pageY - containerY;
		this.setMarkerY(newY);
	}
	n(e) {
		console.log('north');
		const { pageY } = e;
		const newHeight = this.getMarkerHeight() + this.anchorPoint.y - pageY;
		this.setMarkerHeight(newHeight);
		this.anchorPoint.y = pageY;
		const { y: containerY } = this.getLayoutPosition();
		this.setMarkerY(pageY - containerY);
	}
	s(e) {
		console.log('south');
		const { pageY } = e;
		const newHeight = this.getMarkerHeight() + pageY - this.anchorPoint.y;
		this.setMarkerHeight(newHeight);
		this.anchorPoint.y = pageY;
	}
	e(e) {
		console.log('east');
		const { pageX } = e;
		const newWidth = this.getMarkerWidth() + pageX - this.anchorPoint.x;
		this.setMarkerWidth(newWidth);
		this.anchorPoint.x = pageX;
	}
	w(e) {
		console.log('west');
		const { pageX } = e;
		const newWidth = this.getMarkerWidth() + this.anchorPoint.x - pageX;
		this.setMarkerWidth(newWidth);
		this.anchorPoint.x = pageX;

		const { x: containerX } = this.getLayoutPosition();
		console.log(this.getLayoutPosition());
		console.log(containerX - pageX);
		this.setMarkerX(pageX - containerX);
	}
	getMarkerWidth() {
		return getMarker().offsetWidth;
	}
	setMarkerX(x) {
		getMarker().style.left = `${x}px`;
	}
	setMarkerY(y) {
		getMarker().style.top = `${y}px`;
	}
	getMarkerHeight() {
		return getMarker().offsetHeight;
	}
	setMarkerWidth(width) {
		getMarker().style.width = `${width}px`;
	}
	setMarkerHeight(height) {
		getMarker().style.height = `${height}px`;
	}
	mouseMove() {
		switch (this.direction) {
			case 'se':
				return this.se;
			case 'nw':
				return this.nw;
			case 'sw':
				return this.sw;
			case 'ne':
				return this.ne;
			case 'n':
				return this.n;
			case 's':
				return this.s;
			case 'e':
				return this.e;
			case 'w':
				return this.w;
		}
	}
	makeHandle(direction) {
		const handle = document.createElement('div');
		handle.draggable = false;
		handle.style.height = this.height;
		handle.style.width = this.width;
		handle.style.position = 'absolute';
		Object.assign(handle.style, this.styles);
		if (this.shape == 'circle') {
			handle.style.borderRadius = '50%';
		}
		switch (direction) {
			case 'nw':
				handle.style.top = `${this.offset}`;
				handle.style.left = `${this.offset}`;
				break;
			case 'se':
				handle.style.bottom = `${this.offset}`;
				handle.style.right = `${this.offset}`;
				break;
			case 'ne':
				handle.style.right = `${this.offset}`;
				handle.style.top = `${this.offset}`;
				break;
			case 'sw':
				handle.style.left = `${this.offset}`;
				handle.style.bottom = `${this.offset}`;
				break;
			case 'n':
				handle.style.top = `${this.offset}`;
				handle.style.left = '50%';
				handle.style.transform = 'translateX(-50%)';
				break;
			case 's':
				handle.style.bottom = `${this.offset}`;
				handle.style.left = '50%';
				handle.style.transform = 'translateX(-50%)';
				break;
			case 'e':
				handle.style.right = `${this.offset}`;
				handle.style.top = '50%';
				handle.style.transform = 'translateY(-50%)';
				break;
			case 'w':
				handle.style.left = `${this.offset}`;
				handle.style.transform = 'translateY(-50%)';
				handle.style.top = '50%';
				break;
		}
		return handle;
	}
}
