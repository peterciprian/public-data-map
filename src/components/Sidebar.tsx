import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { RefObject, useState } from 'react';
import { BaseLayersConfig, OverlayLayersConfig } from '../config/layersConfig';

import { fromLonLat } from 'ol/proj';

import Map from 'ol/Map';

const drawerWidth = 240;

const Sidebar = ({mapInstance}: {mapInstance: RefObject<Map | null>} ) => {
    
	const [baseLayer, setBaseLayer] = useState(Object.entries(BaseLayersConfig).find(([, layer]) => layer.getVisible())?.[0] || 'osm-default');
    const [visibleOverlays, setVisibleOverlays] = useState<
		Record<string, boolean>
	>(
		Object.entries(OverlayLayersConfig).reduce(
			(acc, [key, layer]) => ({ ...acc, [key]: layer.getVisible() }),
			{}
		)
	);

    const [searchQuery, setSearchQuery] = useState('');	
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

	return (
		<Drawer
			variant="permanent"
			anchor="left"
			sx={{
				width: drawerWidth,
				flexShrink: 0,
				[`& .MuiDrawer-paper`]: {
					width: drawerWidth,
					boxSizing: 'border-box'
				}
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
					value={baseLayer}
					onChange={(e) => {
						const selectedLayer = e.target.value;
						Object.entries(BaseLayersConfig).forEach(
							([id, layer]) => {
								layer.setVisible(id === selectedLayer);
							}
						);
						setBaseLayer(selectedLayer);
					}}
				>
					{Object.entries(BaseLayersConfig).map(([id, layer]) => (
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
					{Object.entries(OverlayLayersConfig).map(([id, layer]) => (
						<FormControlLabel
							key={id}
							control={
								<Checkbox
									checked={visibleOverlays[id] || false}
									onChange={(e) => {
										const newState = {
											...visibleOverlays,
											[id]: e.target.checked
										};
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
	);
};

export default Sidebar;
