import { AppBar, Container, Toolbar, Typography } from "@mui/material";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("../components/Map"), { ssr: false });

export default function HomePage() {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Public Data Map</Typography>
        </Toolbar>
      </AppBar>

      <Container disableGutters maxWidth={false}>
        <Map />
      </Container>
    </>
  );
}
