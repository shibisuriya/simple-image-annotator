export default class Handle {
	constructor({ direction, offset, offsetX, offsetY, shape, width = '5px', height = '5px', styles, helpers }) {
		this.helpers = helpers;
		this.direction = direction;
		this.styles = styles;
		this.offset = offset;
		this.offsetX = offsetX;
		this.offsetY = offsetY;
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
		const newHeight = this.helpers.getMarkerHeight() + pageY - this.anchorPoint.y;
		this.helpers.setMarkerHeight(newHeight);
		this.anchorPoint.y = pageY;

		// Horizontal move
		const newWidth = this.helpers.getMarkerWidth() + pageX - this.anchorPoint.x;
		this.helpers.setMarkerWidth(newWidth);
		this.anchorPoint.x = pageX;
	}
	nw(e) {
		const { pageX, pageY } = e;
		const { x: containerX, y: containerY } = this.helpers.getLayoutPosition();

		// Horizontal move
		const newWidth = this.anchorPoint.x - pageX + this.helpers.getMarkerWidth();
		this.anchorPoint.x = pageX;
		this.helpers.setMarkerX(pageX - containerX);
		this.helpers.setMarkerWidth(newWidth);

		// Vertical move
		const newHeight = this.anchorPoint.y - pageY + this.helpers.getMarkerHeight();
		this.anchorPoint.y = pageY;
		this.helpers.setMarkerY(pageY - containerY);
		this.helpers.setMarkerHeight(newHeight);
	}
	sw(e) {
		const { pageY, pageX } = e;

		// Vertical move
		const newHeight = this.helpers.getMarkerHeight() + pageY - this.anchorPoint.y;
		this.helpers.setMarkerHeight(newHeight);
		this.anchorPoint.y = pageY;

		// Horizontal move

		const newWidth = this.anchorPoint.x - pageX + this.helpers.getMarkerWidth();
		this.helpers.setMarkerWidth(newWidth);
		this.anchorPoint.x = pageX;
		const { x: containerX } = this.helpers.getLayoutPosition();
		this.helpers.setMarkerX(pageX - containerX);
	}
	ne(e) {
		const { pageX, pageY } = e;

		// Horizontal move
		this.helpers.setMarkerWidth(this.helpers.getMarkerWidth() + pageX - this.anchorPoint.x);
		this.anchorPoint.x = pageX;

		// Vertical move
		const newHeight = this.helpers.getMarkerHeight() + this.anchorPoint.y - pageY;
		this.helpers.setMarkerHeight(newHeight);
		this.anchorPoint.y = pageY;

		const { y: containerY } = this.helpers.getLayoutPosition();
		const newY = pageY - containerY;
		this.helpers.setMarkerY(newY);
	}
	n(e) {
		console.log('north');
		const { pageY } = e;
		const newHeight = this.helpers.getMarkerHeight() + this.anchorPoint.y - pageY;
		this.helpers.setMarkerHeight(newHeight);
		this.anchorPoint.y = pageY;
		const { y: containerY } = this.helpers.getLayoutPosition();
		this.helpers.setMarkerY(pageY - containerY);
	}
	s(e) {
		console.log('south');
		const { pageY } = e;
		const newHeight = this.helpers.getMarkerHeight() + pageY - this.anchorPoint.y;
		this.helpers.setMarkerHeight(newHeight);
		this.anchorPoint.y = pageY;
	}
	e(e) {
		console.log('east');
		const { pageX } = e;
		const leftEdgePosition = this.r;
		const boundedByLayout = true;
		if (boundedByLayout == true) {
			// const rightEdgePosition = this.helpers.getLayoutPosition().x + this.getLayoutDimension().width;
			// if (pageX >= rightEdgePosition) {
			// 	const newWidth = this.helpers.getMarkerHeight() +
			// }
		} else {
			const newWidth = this.helpers.getMarkerWidth() + pageX - this.anchorPoint.x;
			this.helpers.setMarkerWidth(newWidth);
			this.anchorPoint.x = pageX;
		}
	}
	w(e) {
		console.log('west');
		const { pageX } = e;
		const newWidth = this.helpers.getMarkerWidth() + this.anchorPoint.x - pageX;
		this.helpers.setMarkerWidth(newWidth);
		this.anchorPoint.x = pageX;

		const { x: containerX } = this.helpers.getLayoutPosition();
		console.log(this.helpers.getLayoutPosition());
		console.log(containerX - pageX);
		this.helpers.setMarkerX(pageX - containerX);
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
		handle.style.boxSizing = 'border-box';
		Object.assign(handle.style, this.styles);
		if (this.shape == 'circle') {
			handle.style.borderRadius = '50%';
		}
		const getOffsetX = () => {
			if (this.offsetX.includes('%')) {
				return `${(parseInt(this.offsetX) / 100) * this.helpers.getMarkerWidth()}px`;
			} else if (this.offsetX) {
				return this.offsetXj;
			} else if (this.offset) {
				return this.offset;
			} else {
				return '0px';
			}
		};
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
				handle.style.bottom = `${this.offsetY}`;
				handle.style.left = '50%';
				handle.style.transform = `translateX(-50%) translateX(${getOffsetX()})`;
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
