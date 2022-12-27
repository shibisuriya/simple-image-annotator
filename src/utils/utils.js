export const getPosition = (el) => {
	const { scrollX, scrollY } = getScroll();
	const { left, top } = el.getBoundingClientRect();
	return {
		x: left + scrollX,
		y: top + scrollY,
	};
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
