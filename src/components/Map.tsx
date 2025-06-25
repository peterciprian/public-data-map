'use client';

import {
	Box,
	Divider,
	Drawer,
	FormControlLabel,
	Radio,
	RadioGroup,
	Toolbar,
	Typography,
} from '@mui/material';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import 'ol/ol.css';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import { useEffect, useRef, useState } from 'react';

const drawerWidth = 240;

const baseLayersConfig = {
	'osm-default': new TileLayer({
		source: new OSM(),
		visible: true,
	}),
	'osm-satellite': new TileLayer({
		source: new XYZ({
			url: 'https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png',
			attributions: '© OpenTopoMap (CC-BY-SA)',
		}),
		visible: false,
	}),
	'osm-humanitarian': new TileLayer({
		source: new XYZ({
			url: 'https://tile-{a-c}.openstreetmap.fr/hot/{z}/{x}/{y}.png',
			attributions: '© OpenStreetMap contributors, Humanitarian style',
		}),
		visible: false,
	}),
};

const layerOptions = [
	{ id: 'osm-default', label: 'OSM Default' },
	{ id: 'osm-satellite', label: 'Topographic' },
	{ id: 'osm-humanitarian', label: 'Humanitarian' },
];

const OLMap = () => {
	const mapRef = useRef<HTMLDivElement>(null);
	const [selectedLayer, setSelectedLayer] = useState('osm-default');
	const mapInstance = useRef<Map | null>(null);

	useEffect(() => {
		if (!mapRef.current) return;

		const layers = Object.values(baseLayersConfig);

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
					<Typography variant="h6" gutterBottom>
						Base Map Layers
					</Typography>
					<Divider sx={{ mb: 2 }} />

					<RadioGroup
						value={selectedLayer}
						onChange={(e) => setSelectedLayer(e.target.value)}
					>
						{layerOptions.map((option) => (
							<FormControlLabel
								key={option.id}
								value={option.id}
								control={<Radio />}
								label={option.label}
							/>
						))}
					</RadioGroup>
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
