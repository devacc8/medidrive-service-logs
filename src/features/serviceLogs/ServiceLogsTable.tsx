import { useState, useCallback } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { selectFilteredServiceLogs, selectServiceLogCount } from './serviceLogsSelectors';
import { deleteServiceLog } from './serviceLogsSlice';
import { StatusChip } from '@/common/components/StatusChip';
import { ConfirmDialog } from '@/common/components/ConfirmDialog';
import { ServiceLogEditDialog } from './ServiceLogEditDialog';
import { ServiceLogFilters } from './ServiceLogFilters';
import type { ServiceLog } from '@/common/types';

export function ServiceLogsTable() {
  const dispatch = useAppDispatch();
  const filteredLogs = useAppSelector(selectFilteredServiceLogs);
  const totalCount = useAppSelector(selectServiceLogCount);

  const [editLog, setEditLog] = useState<ServiceLog | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ServiceLog | null>(null);

  const handleDelete = useCallback(() => {
    if (deleteTarget) {
      dispatch(deleteServiceLog(deleteTarget.id));
      setDeleteTarget(null);
    }
  }, [deleteTarget, dispatch]);

  const handleExport = useCallback(() => {
    const data = JSON.stringify(filteredLogs, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `service-logs-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [filteredLogs]);

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Service Logs ({filteredLogs.length}{filteredLogs.length !== totalCount ? ` / ${totalCount}` : ''})
        </Typography>
        {totalCount > 0 && (
          <Button
            size="small"
            startIcon={<FileDownloadIcon />}
            onClick={handleExport}
          >
            Export JSON
          </Button>
        )}
      </Box>

      <ServiceLogFilters />

      {filteredLogs.length === 0 ? (
        <Typography color="text.secondary" textAlign="center" sx={{ py: 4 }}>
          {totalCount === 0
            ? 'No service logs yet. Create one from a draft.'
            : 'No logs match your search or filters.'}
        </Typography>
      ) : (
        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table size="small" sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>Service Order</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>Provider</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>Car ID</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }} align="right">Odometer (mi)</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>Start Date</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>End Date</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>Type</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow
                  key={log.id}
                  hover
                  sx={{
                    '& .row-actions': { opacity: 0, transition: 'opacity 0.15s' },
                    '&:hover .row-actions': { opacity: 1 },
                  }}
                >
                  <TableCell>{log.serviceOrder}</TableCell>
                  <TableCell>{log.providerId}</TableCell>
                  <TableCell>{log.carId}</TableCell>
                  <TableCell align="right">{log.odometer.toLocaleString()}</TableCell>
                  <TableCell>{log.startDate}</TableCell>
                  <TableCell>{log.endDate}</TableCell>
                  <TableCell>
                    <StatusChip type={log.type} />
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={0.5} justifyContent="flex-end" className="row-actions">
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => setEditLog(log)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" onClick={() => setDeleteTarget(log)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <ServiceLogEditDialog
        open={editLog !== null}
        log={editLog}
        onClose={() => setEditLog(null)}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete Service Log"
        message={`Delete service log "${deleteTarget?.serviceOrder}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </Paper>
  );
}
