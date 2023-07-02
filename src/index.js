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
// const center = fromLonLat([30.341414667303503, 59.93200874413513]);
const map = new Map({
	layers: [
		new TileLayer({ source: new OSM() }),
	],
	view: new View({
		center: fromLonLat([30.341414667303503, 59.93200874413513]),
		zoom: 10,
	}),
	target: 'map',
});
const centerAirCraft = fromLonLat([30.341414667303503, 59.93200874413513]);
const airCraft = new Feature({
	type: 'aircraft',
	geometry: new Point(centerAirCraft),
});
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
set
// const center = [-5639523.95, -3501274.52];
// const map = new Map({
// 	target: document.getElementById('map'),
// 	view: new View({
// 		center: center,
// 		zoom: 10,
// 		minZoom: 2,
// 		maxZoom: 19,
// 	}),
// 	layers: [
// 		new TileLayer({
// 			source: new OSM(),
// 		}),
// 	],
// });

// const enteredLon = -51.175689725290326;
// const enteredLat = -29.968170708126095;
// const endedLon = -50.140228299509076;
// const endedLat = -29.99196158236414;
// const OpenrouterURL = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKeyOpenRouter}&start=${enteredLon},${enteredLat}&end=${endedLon},${endedLat}`;
// // The polyline string is read from a JSON similiar to those returned
// // by directions APIs such as Openrouteservice and Mapbox.
// fetch(OpenrouterURL).then(function (response) {
// 	response.json().then(function (result) {
// 		const polyline = result.features[0].geometry;

// 		const route = new Polyline({
// 			factor: 1e6,
// 		}).readGeometry(polyline, {
// 			dataProjection: 'EPSG:4326',
// 			featureProjection: 'EPSG:3857',
// 		});

// 		const routeFeature = new Feature({
// 			type: 'route',
// 			geometry: route,
// 		});
// 		const startMarker = new Feature({
// 			type: 'icon',
// 			geometry: new Point(route.getFirstCoordinate()),
// 		});
// 		const endMarker = new Feature({
// 			type: 'icon',
// 			geometry: new Point(route.getLastCoordinate()),
// 		});
// 		const position = startMarker.getGeometry().clone();
// 		const geoMarker = new Feature({
// 			type: 'geoMarker',
// 			geometry: position,
// 		});

// 		const styles = {
// 			'route': new Style({
// 				stroke: new Stroke({
// 					width: 6,
// 					color: [237, 212, 0, 0.8],
// 				}),
// 			}),
// 			'icon': new Style({
// 				image: new Icon({
// 					anchor: [0.5, 1],
// 					src: 'data/icon.png',
// 				}),
// 			}),
// 			'geoMarker': new Style({
// 				image: new CircleStyle({
// 					radius: 7,
// 					fill: new Fill({ color: 'black' }),
// 					stroke: new Stroke({
// 						color: 'white',
// 						width: 2,
// 					}),
// 				}),
// 			}),
// 		};

// 		const vectorLayer = new VectorLayer({
// 			source: new VectorSource({
// 				features: [routeFeature, geoMarker, startMarker, endMarker],
// 			}),
// 			style: function (feature) {
// 				return styles[feature.get('type')];
// 			},
// 		});

// 		map.addLayer(vectorLayer);
map.on('singleclick', (e) => {
	const coordinate = e.coordinate;
	console.log(coordinate);
	let coordforStart = false;
	console.log(toLonLat([coordinate[0], coordinate[1]]))
});

// 		const speedInput = document.getElementById('speed');
// 		const startButton = document.getElementById('start-animation');
// 		let animating = false;
// 		let distance = 0;
// 		let lastTime;

// 		function moveFeature(event) {
// 			const speed = Number(speedInput.value);
// 			const time = event.frameState.time;
// 			const elapsedTime = time - lastTime;
// 			distance = (distance + (speed * elapsedTime) / 1e6) % 2;
// 			lastTime = time;

// 			const currentCoordinate = route.getCoordinateAt(
// 				distance > 1 ? 2 - distance : distance
// 			);
// 			position.setCoordinates(currentCoordinate);
// 			const vectorContext = getVectorContext(event);
// 			vectorContext.setStyle(styles.geoMarker);
// 			vectorContext.drawGeometry(position);
// 			// tell OpenLayers to continue the postrender animation
// 			map.render();
// 		}

// 		function startAnimation() {
// 			animating = true;
// 			lastTime = Date.now();
// 			startButton.textContent = 'Stop Animation';
// 			vectorLayer.on('postrender', moveFeature);
// 			// hide geoMarker and trigger map render through change event
// 			geoMarker.setGeometry(null);
// 		}

// 		function stopAnimation() {
// 			animating = false;
// 			startButton.textContent = 'Start Animation';

// 			// Keep marker at current animation position
// 			geoMarker.setGeometry(position);
// 			vectorLayer.un('postrender', moveFeature);
// 		}

// 		startButton.addEventListener('click', function () {
// 			if (animating) {
// 				stopAnimation();
// 			} else {
// 				startAnimation();
// 			}
// 		});
// 	});
// });
