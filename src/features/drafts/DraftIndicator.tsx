import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Box from '@mui/material/Box';
import { useAppSelector } from '@/app/store';
import { selectActiveDraft } from './draftsSelectors';
import { DraftSaveStatus } from '@/common/types';

export function DraftIndicator() {
  const draft = useAppSelector(selectActiveDraft);

  if (!draft) return null;

  const { saveStatus } = draft;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      {saveStatus === DraftSaveStatus.Saving && (
        <>
          <CircularProgress size={14} />
          <Typography variant="caption" color="text.secondary">
            Saving...
          </Typography>
        </>
      )}
      {saveStatus === DraftSaveStatus.Saved && (
        <>
          <CheckCircleIcon sx={{ fontSize: 16 }} color="success" />
          <Typography variant="caption" color="success.main">
            Draft saved
          </Typography>
        </>
      )}
    </Box>
  );
}
