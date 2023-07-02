import Feature from 'ol/Feature.js';
import Map from 'ol/Map.js';
import Point from 'ol/geom/Point.js';
import VectorSource from 'ol/source/Vector.js';
import View from 'ol/View.js';
import { toLonLat, fromLonLat } from 'ol/proj';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';
import OSM from 'ol/source/OSM.js';
import aircraft from './img/airplane.png';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
const center = fromLonLat([30.341414667303503, 59.93200874413513]);
// угловые координаты перевести в декартовые с помощью функции fromLonLat
const centerAirCraft = fromLonLat([30.341414667303503, 59.93200874413513]);
const start = [30.341414667303503, 59.93200874413513]
let x = start[0];
let y = start[1];
const map = new Map({
	layers: [
		new TileLayer({ source: new OSM() }),
	],
	view: new View({
		center: center,
		zoom: 10,
	}),
	target: 'map',
});

const airCraft = new Feature({
	type: 'aircraft',
	geometry: new Point(centerAirCraft),
});
const position = airCraft.getGeometry().clone();
const styles = {
	'aircraft': new Style({
		image: new Icon({
			anchor: [0.5, 0.5],
			src: aircraft,
			scale: 0.1,
		}),
	}),
};
const vectorLayer = new VectorLayer({
	source: new VectorSource({
		features: [airCraft],
	}),
	style: function (feature) {
		return styles[feature.get('type')];
	},
});
map.addLayer(vectorLayer);

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
let direction =
	function getCoordinateToMove(x, y, elapsedTime, speed, direction) {

		let speedX = speed * sinA;
		let speedY = speed * cosA;

		let nextX = x + (speedX * elapsedTime);
		let nextY = y + (speedY * elapsedTime);
		return [nextX, nextY]
	}

function moveFeature(event, x, y, direction) {
	const speed = Number(speedInput.value);
	const time = event.frameState.time;
	const elapsedTime = time - lastTime;

	lastTime = time;

	const currentCoordinate = getCoordinateToMove(x, y, elapsedTime, speed, direction);

	position.setCoordinates(currentCoordinate);
	const vectorContext = getVectorContext(event);
	vectorContext.setStyle(styles.airCraft);
	vectorContext.drawGeometry(position);
	// tell OpenLayers to continue the postrender animation
	map.render();
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

map.on('singleclick', (e) => {
	const coordinate = e.coordinate;
	console.log(coordinate);
	let coordforStart = false;
	console.log(toLonLat([coordinate[0], coordinate[1]]))
});
function startAnimation() {
	animating = true;
	lastTime = Date.now();
	startButton.textContent = 'Stop Animation';
	vectorLayer.on('postrender', moveFeature);
	// hide geoMarker and trigger map render through change event
	geoMarker.setGeometry(null);
}

function stopAnimation() {
	animating = false;
	startButton.textContent = 'Start Animation';

	// Keep marker at current animation position
	geoMarker.setGeometry(position);
	vectorLayer.un('postrender', moveFeature);
}

startButton.addEventListener('click', function () {
	if (animating) {
		stopAnimation();
	} else {
		startAnimation();
	}
});