import Layout from './layout.js';
const getLayout = () => {
	const [el] = document.getElementsByClassName('layout');
	return el;
};
const layout = new Layout({
	layout: getLayout(),
	markers: [
		{
			width: 160,
			height: 127,
			x: 44,
			y: 70,
			options: {
				// If `options` is not provided then the `markerOptions` supplied.
				handles: [
					{
						direction: 'se',
						offset: '-17px',
						shape: 'circle',
						width: '30px',
						height: '500px',
						showWhileInserting: false,
					},
				],
				slot: {
					element: document.getElementById('test-input-box'),
					direction: 's',
					offsetX: '-60px',
					offsetY: '5px',
				},
				alwaysShowMarkers: true,
				showMarkersOnHover: false,
				showMarkersOnClick: false,
				shape: 'square | circle',
				boundedByLayout: true,
				styles: {
					border: '3px dotted yellow',
				},
			},
		},
		{ width: 242, height: 110, x: 188, y: 290 },
	],
	markerOptions: {
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
			{ direction: 'e', offset: '-15px', width: '20px', height: '20px' },
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
// 1) Show handles only on hover.
