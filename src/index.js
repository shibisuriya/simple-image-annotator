import Layout from './layout.js';
const getLayout = () => {
	const [el] = document.getElementsByClassName('layout');
	return el;
};
const layout = new Layout(getLayout());
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

save.addEventListener('mousedown', () => {
	const [data] = document.getElementsByClassName('data');
	data.innerHTML = JSON.stringify(layout.save());
});
