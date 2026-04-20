'use client';

import Box from '@mui/material/Box';
import Map from 'ol/Map';
import View from 'ol/View';
import 'ol/ol.css';
import { useEffect, useRef } from 'react';
import { BaseLayersConfig, OverlayLayersConfig } from '../config/layersConfig';
import Sidebar from './Sidebar';

const OLMap = () => {
	const mapRef = useRef<HTMLDivElement>(null);
	const mapInstance = useRef<Map | null>(null);

	useEffect(() => {
		if (!mapRef.current) return;

		const layers = Object.values({
			...BaseLayersConfig,
			...OverlayLayersConfig
		});

		const map = new Map({
			target: mapRef.current,
			layers,
			view: new View({
				center: [0, 0],
				zoom: 2
			})
		});
		mapInstance.current = map;

		return () => map.setTarget(undefined);
	}, []);

	return (
		<Box sx={{ display: 'flex', height: '100vh' }}>
			<Sidebar mapInstance={mapInstance} />
			{/* Map */}
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					height: '100vh'
				}}
			>
				<div ref={mapRef} style={{ width: '100%', height: '100%' }} />
			</Box>
		</Box>
	);
};

export default OLMap;
