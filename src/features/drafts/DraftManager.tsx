import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { selectDraftsList, selectActiveDraftId, selectDraftCount } from './draftsSelectors';
import { createDraft, deleteDraft, clearAllDrafts, setActiveDraft } from './draftsSlice';
import { DraftSaveStatus } from '@/common/types';
import { formatRelativeTime } from '@/common/utils/dateUtils';

export function DraftManager() {
  const dispatch = useAppDispatch();
  const drafts = useAppSelector(selectDraftsList);
  const activeDraftId = useAppSelector(selectActiveDraftId);
  const draftCount = useAppSelector(selectDraftCount);

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6">Drafts ({draftCount})</Typography>
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => dispatch(createDraft())}
          >
            New Draft
          </Button>
          {draftCount > 0 && (
            <Button
              size="small"
              variant="outlined"
              color="error"
              startIcon={<DeleteSweepIcon />}
              onClick={() => dispatch(clearAllDrafts())}
            >
              Clear All
            </Button>
          )}
        </Stack>
      </Box>

      {drafts.length === 0 ? (
        <Typography color="text.secondary" textAlign="center" sx={{ py: 3 }}>
          No drafts yet. Create one to start.
        </Typography>
      ) : (
        <List dense disablePadding>
          {drafts.map((draft, idx) => (
            <Box key={draft.id}>
              {idx > 0 && <Divider />}
              <ListItemButton
                selected={draft.id === activeDraftId}
                onClick={() => dispatch(setActiveDraft(draft.id))}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  {draft.saveStatus === DraftSaveStatus.Saved ? (
                    <CheckCircleIcon fontSize="small" color="success" />
                  ) : (
                    <DescriptionIcon fontSize="small" color="action" />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={draft.formValues.serviceOrder || 'Untitled draft'}
                  secondary={`Updated ${formatRelativeTime(draft.updatedAt)}`}
                  primaryTypographyProps={{ noWrap: true }}
                />
                <IconButton
                  edge="end"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(deleteDraft(draft.id));
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </ListItemButton>
            </Box>
          ))}
        </List>
      )}
    </Paper>
  );
}
