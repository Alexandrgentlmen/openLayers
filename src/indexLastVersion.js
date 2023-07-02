//  включение слежки за ./index.html
import './index.html';
//  включение слежки за ./index.scss
import './index.scss';
import aircraft from './img/airplane.png'

import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
// функции преобразования широты и долготы в координаты
import { toLonLat, fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import OSM from 'ol/source/OSM.js';

import Icon from 'ol/style/Icon';
import Style from 'ol/style/Style';
import Point from 'ol/geom/Point';
import Stroke from 'ol/style/Stroke';
import Overlay from 'ol/Overlay';
// для инф окна
import { Circle as CircleStyle, Fill } from 'ol/style';
import Polyline from 'ol/format/Polyline';
const apiKeyOpenRouter = '5b3ce3597851110001cf62486e51bf949cde4c759ddcbf344bfdfc7f';
import { getVectorContext } from 'ol/render.js';
// import XYZ from 'ol/source/XYZ';


document.addEventListener("DOMContentLoaded", getStartedFlying)

function getStartedFlying() {

	//  все элементы на карте
	const popup = document.querySelector('.popup');
	const mapHolder = document.querySelector('.map');
	const enteredLon = 30.341414667303503;
	const enteredLat = 59.93200874413513;
	const endedLon = 30.428948;
	const endedLat = 59.964267;
	const OpenrouterURL = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKeyOpenRouter}&start=${enteredLon},${enteredLat}&end=${endedLon},${endedLat}`;
	//  lon , lat
	const center = fromLonLat([30.341414667303503, 59.93200874413513]);
	const finisher = fromLonLat([endedLon, endedLat]);
	const speedInput = document.getElementById('speed');
	const startButton = document.getElementById('start-animation');
	let animating = false;
	let distance = 0;
	let lastTime;

	const map = new Map({
		target: mapHolder,
		view: new View({
			center: center,
			zoom: 11,
			minZoom: 2,
			maxZoom: 19,
		}),
		layers: [
			new TileLayer({
				source: new OSM(),
			})
		],
	});
	fetch(OpenrouterURL, {
		headers: {
			'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8'
		}
	}).then(function (response) {
		response.json().then(function (result) {
			console.log('result.routes', result.features[0].geometry)
			const polyline = result.features[0].geometry;
			const route = new Polyline({
				factor: 1e6,
			}).readGeometry(polyline, {
				dataProjection: 'EPSG:4326',
				featureProjection: 'EPSG:3857',
			});

			const routeFeature = new Feature({
				type: 'route',
				geometry: route,
			});
			const startMarker = new Feature({
				type: 'geoMarker',
				geometry: new Point(route.getFirstCoordinate()),
			});
			const endMarker = new Feature({
				type: 'geoMarker',
				geometry: new Point(route.getLastCoordinate()),
			});

			const airCraft = new Feature({
				type: 'aircraft',
				geometry: new Point(center),
			});
			const position = startMarker.getGeometry().clone();
			const geoMarker = new Feature({
				type: 'geoMarker',
				geometry: position,
			});

			const overlay = new Overlay({
				element: popup,
				autoPan: true,
				autoPanAnimation: {
					duration: 250,
				},
			})

			const styles = {
				'route': new Style({
					stroke: new Stroke({
						width: 6,
						color: [237, 212, 0, 0.8],
					}),
				}),
				'aircraft': new Style({
					image: new Icon({
						anchor: [0.5, 0.5],
						src: aircraft,
						scale: 0.1,
					}),
				}),
				'geoMarker': new Style({
					image: new CircleStyle({
						radius: 7,
						fill: new Fill({ color: 'black' }),
						stroke: new Stroke({
							color: 'white',
							width: 2,
						}),
					}),
				}),
			};
			const vectorLayer = new VectorLayer({
				source: new VectorSource({
					features: [startMarker, endMarker, routeFeature, airCraft, geoMarker],
				}),
				style: function (feature) {
					return styles[feature.get('type')];
				},
			});
			map.addLayer(vectorLayer);
			map.on('singleclick', (e) => {
				const coordinate = e.coordinate;

				let coordforStart = false;
				console.log(toLonLat([coordinate[0], coordinate[1]]))
			});



			function updatePosition() {
				if (map) {
					if (airCraft) {
						// у feature есть метод getGeometry и для изменения положения на карте нужно менять именно обхъект геометрии
						airCraft.getGeometry().setCoordinates(fromLonLat([enteredLon, enteredLat]))
					}
				}
			}

			function moveFeature(event) {
				const speed = Number(speedInput.value);
				const time = event.frameState.time;
				const elapsedTime = time - lastTime;
				distance = (distance + (speed * elapsedTime) / 1e6) % 2;
				lastTime = time;

				const currentCoordinate = route.getCoordinateAt(
					distance > 1 ? 2 - distance : distance
				);
				position.setCoordinates(currentCoordinate);
				const vectorContext = getVectorContext(event);
				vectorContext.setStyle(styles.geoMarker);
				vectorContext.drawGeometry(position);
				// tell OpenLayers to continue the postrender animation
				map.render();
			}


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
		}).catch((err) => {
			console.log(err)
		})

	});
};