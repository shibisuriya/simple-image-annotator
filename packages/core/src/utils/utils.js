export const getPosition = (el) => {
	const { scrollX, scrollY } = getScroll();
	const { left, top } = el.getBoundingClientRect();
	const x = left + scrollX;
	const y = top + scrollY;
	return {
		x,
		y,
		leftEdgeX: x,
		leftEdgeY: y,
		rightEdgeX: left + getDimension(el).width,
		rightEdgeY: top,
		topEdgeY: y,
		topEdgeX: x,
		bottomEdgeX: x,
		bottomEdgeY: y + getDimension(el).height,
	};
};

// Check if the supplied string is a valid CSS value or not.
export const isValidUnit = (value) => {
	return value.includes('px') || value.includes('%');
};

export const getDimension = (el) => {
	const { width, height } = el.getBoundingClientRect();
	return {
		width,
		height,
	};
};

export const getScroll = () => {
	const { scrollX, scrollY } = window;
	return {
		scrollX,
		scrollY,
	};
};

export const isEmpty = (obj) => {
	return Object.keys(obj).length === 0 && obj.constructor === Object;
};
