import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { useAppDispatch } from '@/app/store';
import { updateServiceLog } from './serviceLogsSlice';
import { ServiceLogForm } from '@/features/serviceLogForm/ServiceLogForm';
import type { ServiceLog, ServiceLogFormValues } from '@/common/types';

interface ServiceLogEditDialogProps {
  open: boolean;
  log: ServiceLog | null;
  onClose: () => void;
}

function logToFormValues(log: ServiceLog): ServiceLogFormValues {
  return {
    providerId: log.providerId,
    serviceOrder: log.serviceOrder,
    carId: log.carId,
    odometer: log.odometer,
    engineHours: log.engineHours,
    startDate: log.startDate,
    endDate: log.endDate,
    type: log.type,
    serviceDescription: log.serviceDescription,
  };
}

export function ServiceLogEditDialog({ open, log, onClose }: ServiceLogEditDialogProps) {
  const dispatch = useAppDispatch();

  if (!log) return null;

  const handleSave = (values: ServiceLogFormValues) => {
    dispatch(updateServiceLog({ id: log.id, values }));
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Service Log</DialogTitle>
      <DialogContent sx={{ pt: '16px !important' }}>
        <ServiceLogForm
          mode="edit"
          initialValues={logToFormValues(log)}
          onSubmit={handleSave}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
