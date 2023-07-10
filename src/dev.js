import { Layout } from './index.js';
import './index.css';
import './index.scss';

const getLayout = () => {
	const [el] = document.getElementsByClassName('layout');
	return el;
};
const layout = new Layout({
	layout: getLayout(),
	markers: [
		// {
		// 	layoutWidth: 200,
		// 	layoutHeight: 300,
		// 	width: 160,
		// 	height: 127,
		// 	x: 44,
		// 	y: 70,
		// 	// This `options` applies to only this specific marker.
		// 	options: {
		// 		handles: {
		// 			directions: ['e', 'w', 's', 'n', 'sw', 'nw', 'ne', 'se'],
		// 			offset: '-30px',
		// 			height: '30px',
		// 			width: '30px',
		// 			styles: {
		// 				border: '5px solid white',
		// 			},
		// 		},
		// 		// slot: {
		// 		// 	element: document.getElementById('test-input-box'),
		// 		// 	direction: 's',
		// 		// 	offsetX: '-60px',
		// 		// 	offsetY: '5px',
		// 		// 	alwaysShow: true,
		// 		// 	showOnHover: true,
		// 		// },
		// 		minWidth: '100px',
		// 		minHeight: '100px',
		// 		maxWidth: '500px',
		// 		maxHeight: '500px',
		// 		boundedByLayout: true,
		// 		styles: {
		// 			border: '3px dotted yellow',
		// 		},
		// 	},
		// },
	],
	// `markerOptions` applies to fresh markers that will be inserted into the layout by the user in the future.
	markerOptions: {
		handles: {
			directions: ['e', 'w', 's', 'n', 'sw', 'nw', 'ne', 'se'],
			offset: '-60px',
			height: '30px',
			width: '30px',
			// Make this default options for better UX.
			// showHandlesWhileInserting: true,
			// showHandlesWhileMoving: true,
			onlyShowHandlesOnHover: true,
			styles: {
				// Handle's styles.
				border: '5px solid white',
				backgroundColor: 'green',
			},
		},
		// slot: {
		// 	element: document.getElementById('test-input-box'),
		// 	direction: 'ne',
		// 	offsetX: '10px',
		// 	offsetY: '10px',
		// },
		minWidth: '100px',
		minHeight: '100px',
		maxWidth: '500px',
		maxHeight: '500px',
		styles: {
			// Marker's styles.
			border: '3px dotted yellow',
		},
	},
});

layout.on('engaged', (event) => {
	console.log(event);
});
layout.on('disengaged', (event) => {
	console.log(event);
});
layout.on('moved', (event) => {
	console.log(event);
});
layout.on('resized', (event) => {
	console.log(event);
});
layout.on('removed', (event) => {
	console.log(event);
});

save.addEventListener('click', () => {
	const [data] = document.getElementsByClassName('data');
	data.innerHTML = JSON.stringify(layout.save());
});
changeMarkerOptions.addEventListener('click', () => {
	console.log('changerMakerOptions');
	layout.setMarkerOptions({
		handles: [
			{ direciton: 'e', offset: '-15px', width: '20px', height: '20px' },
			{ direction: 's', offset: '-15px', width: '20px', height: '20px' },
			{ direction: 'n', offset: '-15px', width: '20px', height: '20px' },
		],
		styles: {
			border: '5px solid violet',
		},
	});
});
start.addEventListener('click', () => {
	console.log('Started');
	layout.start();
});
Stop.addEventListener('click', () => {
	console.log('Stopped.');
	layout.stop();
});
document.getElementById('destory').addEventListener('click', () => {
	console.log('Destory');
	layout.destroy();
});
// To-do(s)
// 1) Test inserting fully.
// 2) Moving.
// 3) Resizing.
// 1) Show handles only on hover.
