import Layout from './layout.js';
const getLayout = () => {
	const [el] = document.getElementsByClassName('layout');
	return el;
};
const layout = new Layout({
	layout: getLayout(),
	markerOptions: {
		handles: [
			{ direction: 'se', offset: '-17px', shape: 'circle', width: '30px', height: '500px' },
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
			{ direction: 's', offset: '-5px', width: '20px', height: '20px' },
		],
		alwaysShowMarkers: true,
		showMarkersOnHover: false,
		showMarkersOnClick: false,
		shape: 'square | circle',
		minWidth: '100px',
		minHeight: '100px',
		maxWidth: '100px',
		maxHeight: '100px',
		styles: {
			border: '1px solid green',
		},
	},
});
// layout.on('engaged', (event) => {
// 	console.log(event);
// });
layout.on('disengaged', (event) => {
	console.log(event);
});
// layout.on('moved', (event) => {
// 	console.log(event);
// });
// layout.on('resized', (event) => {
// 	console.log(event);
// });
// layout.on('removed', (event) => {
// 	console.log(event);
// });

save.addEventListener('click', () => {
	const [data] = document.getElementsByClassName('data');
	data.innerHTML = JSON.stringify(layout.save());
});
changeMarkerOptions.addEventListener('click', () => {
	console.log('changerMakerOptions');
	layout.setMarkerOptions({ handles: ['e', 'w'] });
});
