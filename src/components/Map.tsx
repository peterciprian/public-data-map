'use client';

import {
	Box,
	Button,
	Checkbox,
	Divider,
	Drawer,
	FormControlLabel,
	Radio,
	RadioGroup,
	Stack,
	TextField,
	Toolbar,
	Typography,
} from '@mui/material';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import ImageLayer from 'ol/layer/Image';
import 'ol/ol.css';
import { fromLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import ImageWMS from 'ol/source/ImageWMS';
import { useEffect, useRef, useState } from 'react';

const drawerWidth = 240;

const baseLayersConfig = {
	'osm-default': new TileLayer({
		source: new OSM(),
		visible: false,
		properties: { name: 'OSM Default' },
	}),
	'osm-satellite': new TileLayer({
		source: new XYZ({
			url: 'https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png',
			attributions: '© OpenTopoMap (CC-BY-SA)',
		}),
		visible: false,
		properties: { name: 'OSM Satellite' },
	}),
	'osm-humanitarian': new TileLayer({
		source: new XYZ({
			url: 'https://tile-{a-c}.openstreetmap.fr/hot/{z}/{x}/{y}.png',
			attributions: '© OpenStreetMap contributors, Humanitarian style',
		}),
		visible: false,
		properties: { name: 'OSM Humanitarian' },
	}),
	'esri-world_Imagery': new TileLayer({
		source: new XYZ({
			url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
			attributions: 'Tiles © Esri',
		}),
		properties: { name: 'World Imagery' },
		visible: true,
	}),
};

const overlayLayersConfig = {
	'turistautak': new ImageLayer({
		source: new ImageWMS({
			url: 'https://gis.turistaterkepek.hu/server/services/turistaut_nyilvantartas/nyilvantartas_wms/MapServer/WMSServer',
			params: { 'LAYERS': '0' },
			attributions: 'Turistautak.hu',
		}),
		visible: false,
		properties: { name: 'Turistautak' },
	}),
};


const OLMap = () => {
	const mapRef = useRef<HTMLDivElement>(null);
	const [selectedLayer, setSelectedLayer] = useState('osm-default');
	const mapInstance = useRef<Map | null>(null);
	const [searchQuery, setSearchQuery] = useState('');
	const [visibleOverlays, setVisibleOverlays] = useState<Record<string, boolean>>(
		Object.keys(overlayLayersConfig).reduce((acc, key) => ({ ...acc, [key]: false }), {})
	);
	const searchUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
		searchQuery
	)}&format=json&limit=1`;

	const handleSearch = async () => {
		try {
			const res = await fetch(searchUrl);
			const data = await res.json();
			if (data && data.length > 0) {
				const { lat, lon } = data[0];
				const coords = [parseFloat(lon), parseFloat(lat)];
				const view = mapInstance.current?.getView();
				view?.setCenter(fromLonLat(coords));
				view?.setZoom(14);
			} else {
				alert('Location not found.');
			}
		} catch (err) {
			console.error(err);
			alert('Error searching location.');
		}
	};

	useEffect(() => {
		if (!mapRef.current) return;

		const layers = Object.values({ ...baseLayersConfig, ...overlayLayersConfig });

		const map = new Map({
			target: mapRef.current,
			layers,
			view: new View({
				center: [0, 0],
				zoom: 2,
			}),
		});

		mapInstance.current = map;

		return () => map.setTarget(undefined);
	}, []);

	useEffect(() => {
		Object.entries(baseLayersConfig).forEach(([id, layer]) => {
			layer.setVisible(id === selectedLayer);
		});
	}, [selectedLayer]);

	return (
		<Box sx={{ display: 'flex', height: '100vh' }}>
			{/* Sidebar */}
			<Drawer
				variant="permanent"
				anchor="left"
				sx={{
					width: drawerWidth,
					flexShrink: 0,
					[`& .MuiDrawer-paper`]: {
						width: drawerWidth,
						boxSizing: 'border-box',
					},
				}}
			>
				<Toolbar />
				<Box sx={{ overflow: 'auto', p: 2 }}>
					<Stack spacing={1} direction="row" sx={{ mb: 2 }}>
						<TextField
							size="small"
							fullWidth
							label="Search location"
							variant="outlined"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
						<Button
							variant="contained"
							onClick={async () => {
								if (!searchQuery) return;
								handleSearch();
							}}
						>
							Go
						</Button>
					</Stack>
					<Divider sx={{ mb: 2 }} />
					<Typography variant="h6" gutterBottom>
						Base Map Layers
					</Typography>
					<Divider sx={{ mb: 2 }} />

					<RadioGroup
						value={selectedLayer}
						onChange={(e) => setSelectedLayer(e.target.value)}
					>
						{Object.entries(baseLayersConfig).map(([id, layer]) => (
							<FormControlLabel
								key={id}
								value={id}
								control={<Radio />}
								label={layer.get('name')}
							/>
						))}
					</RadioGroup>

					<Divider sx={{ mb: 2 }} />
					<Typography variant="h6" gutterBottom>
						Overlay Layers
					</Typography>
					<Divider sx={{ mb: 2 }} />

					<Stack spacing={1}>
						{Object.entries(overlayLayersConfig).map(([id, layer]) => (
							<FormControlLabel
								key={id}
								control={
									<Checkbox
										checked={visibleOverlays[id] || false}
										onChange={(e) => {
											const newState = { ...visibleOverlays, [id]: e.target.checked };
											setVisibleOverlays(newState);
											layer.setVisible(e.target.checked);
										}}
									/>
								}
								label={layer.get('name')}
							/>
						))}
					</Stack>
					
				</Box>
			</Drawer>

			{/* Map */}
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					height: '100vh',
				}}
			>
				<div ref={mapRef} style={{ width: '100%', height: '100%' }} />
			</Box>
		</Box>
	);
};

export default OLMap;
