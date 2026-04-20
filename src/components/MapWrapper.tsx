'use client';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import dynamic from 'next/dynamic';

// Dynamically import the map with SSR disabled
const OLMap = dynamic(() => import('./Map'), {
	ssr: false,
	loading: () => (
		<Box
			display="flex"
			justifyContent="center"
			alignItems="center"
			height="100vh"
		>
			<CircularProgress />
		</Box>
	),
});

export default function MapWrapper() {
	return <OLMap />;
}
