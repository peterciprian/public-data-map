import MapWrapper from '@components/MapWrapper';
import { AppBar, Container, Toolbar, Typography } from '@mui/material';

export default function HomePage() {
	return (
		<>
			<AppBar position="static">
				<Toolbar>
					<Typography variant="h6">Public Data Map</Typography>
				</Toolbar>
			</AppBar>

			<Container disableGutters maxWidth={false}>
				<MapWrapper />
			</Container>
		</>
	);
}
