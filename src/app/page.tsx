import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MapWrapper from '@components/MapWrapper';

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
