import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { DraftManager } from '@/features/drafts/DraftManager';
import { ServiceLogForm } from '@/features/serviceLogForm/ServiceLogForm';
import { ServiceLogsTable } from '@/features/serviceLogs/ServiceLogsTable';

export default function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
            MediDrive — Service Log Manager
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ flexGrow: 1, py: 3 }}>
        <Grid container spacing={3}>
          {/* Left panel: drafts + form */}
          <Grid size={{ xs: 12, md: 5, lg: 4 }}>
            <DraftManager />
            <ServiceLogForm mode="draft" />
          </Grid>

          {/* Right panel: table */}
          <Grid size={{ xs: 12, md: 7, lg: 8 }}>
            <ServiceLogsTable />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
