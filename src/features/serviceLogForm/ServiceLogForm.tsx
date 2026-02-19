import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import SaveIcon from '@mui/icons-material/Save';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { selectActiveDraft, selectActiveDraftId } from '@/features/drafts/draftsSelectors';
import { deleteDraft } from '@/features/drafts/draftsSlice';
import { createServiceLog } from '@/features/serviceLogs/serviceLogsSlice';
import { ServiceType, type ServiceLogFormValues } from '@/common/types';
import { today, tomorrow } from '@/common/utils/dateUtils';
import { serviceLogSchema } from './validationSchema';
import { useAutoSave } from './useAutoSave';
import { useDateSync } from './useDateSync';
import { DraftIndicator } from '@/features/drafts/DraftIndicator';

interface ServiceLogFormProps {
  mode: 'draft' | 'edit';
  initialValues?: ServiceLogFormValues;
  onSubmit?: (values: ServiceLogFormValues) => void;
  onCancel?: () => void;
}

const SERVICE_TYPE_OPTIONS = [
  { value: ServiceType.Planned, label: 'Planned' },
  { value: ServiceType.Unplanned, label: 'Unplanned' },
  { value: ServiceType.Emergency, label: 'Emergency' },
];

function defaultFormValues(): ServiceLogFormValues {
  return {
    providerId: '',
    serviceOrder: '',
    carId: '',
    odometer: '',
    engineHours: '',
    startDate: today(),
    endDate: tomorrow(),
    type: ServiceType.Planned,
    serviceDescription: '',
  };
}

export function ServiceLogForm({ mode, initialValues, onSubmit, onCancel }: ServiceLogFormProps) {
  const dispatch = useAppDispatch();
  const activeDraftId = useAppSelector(selectActiveDraftId);
  const activeDraft = useAppSelector(selectActiveDraft);

  // Known type mismatch: our form uses `number | ''` for empty numeric inputs,
  // but Yup infers strict `number`. The cast is safe — Yup validates before submit.
  // See: https://github.com/react-hook-form/resolvers/issues/440
  const form = useForm<ServiceLogFormValues>({
    resolver: yupResolver(serviceLogSchema) as never,
    defaultValues: initialValues ?? defaultFormValues(),
    mode: 'onSubmit',
  });

  const { control, handleSubmit, reset, setValue, formState: { errors } } = form;

  // Auto-save (only in draft mode)
  useAutoSave(control, mode === 'draft');

  // Date sync: startDate change → endDate = startDate + 1
  useDateSync(control, setValue);

  // Reset form when active draft changes (draft mode only)
  useEffect(() => {
    if (mode === 'draft' && activeDraft) {
      reset(activeDraft.formValues);
    }
  }, [activeDraftId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFormSubmit = handleSubmit((values) => {
    if (mode === 'edit' && onSubmit) {
      onSubmit(values);
      return;
    }

    // Draft mode → create service log and delete the draft
    dispatch(createServiceLog(values));
    if (activeDraftId) {
      dispatch(deleteDraft(activeDraftId));
    }
  });

  const isDraftMode = mode === 'draft';
  const isDisabled = isDraftMode && !activeDraftId;

  if (isDraftMode && !activeDraftId) {
    return (
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography color="text.secondary" textAlign="center">
          Create or select a draft to start filling the form.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, mt: isDraftMode ? 2 : 0 }}>
      {isDraftMode && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Service Log Form</Typography>
          <DraftIndicator />
        </Box>
      )}

      <Box component="form" onSubmit={handleFormSubmit} noValidate>
        <Stack spacing={2}>
          <Controller
            name="providerId"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Provider ID"
                error={!!errors.providerId}
                helperText={errors.providerId?.message}
                disabled={isDisabled}
                fullWidth
              />
            )}
          />

          <Controller
            name="serviceOrder"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Service Order"
                error={!!errors.serviceOrder}
                helperText={errors.serviceOrder?.message}
                disabled={isDisabled}
                fullWidth
              />
            )}
          />

          <Controller
            name="carId"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Car ID"
                error={!!errors.carId}
                helperText={errors.carId?.message}
                disabled={isDisabled}
                fullWidth
              />
            )}
          />

          <Controller
            name="odometer"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                onChange={(e) => {
                  const val = e.target.value;
                  field.onChange(val === '' ? '' : Number(val));
                }}
                label="Odometer"
                type="number"
                error={!!errors.odometer}
                helperText={errors.odometer?.message}
                disabled={isDisabled}
                fullWidth
                InputProps={{
                  endAdornment: <InputAdornment position="end">mi</InputAdornment>,
                }}
              />
            )}
          />

          <Controller
            name="engineHours"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                onChange={(e) => {
                  const val = e.target.value;
                  field.onChange(val === '' ? '' : Number(val));
                }}
                label="Engine Hours"
                type="number"
                error={!!errors.engineHours}
                helperText={errors.engineHours?.message}
                disabled={isDisabled}
                fullWidth
                InputProps={{
                  endAdornment: <InputAdornment position="end">hrs</InputAdornment>,
                }}
              />
            )}
          />

          <Controller
            name="startDate"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Start Date"
                type="date"
                error={!!errors.startDate}
                helperText={errors.startDate?.message}
                disabled={isDisabled}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            )}
          />

          <Controller
            name="endDate"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="End Date"
                type="date"
                error={!!errors.endDate}
                helperText={errors.endDate?.message}
                disabled={isDisabled}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            )}
          />

          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Service Type"
                error={!!errors.type}
                helperText={errors.type?.message}
                disabled={isDisabled}
                fullWidth
              >
                {SERVICE_TYPE_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          <Controller
            name="serviceDescription"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Service Description"
                multiline
                rows={3}
                error={!!errors.serviceDescription}
                helperText={errors.serviceDescription?.message}
                disabled={isDisabled}
                fullWidth
              />
            )}
          />

          <Stack direction="row" spacing={1} justifyContent="flex-end">
            {mode === 'edit' && onCancel && (
              <Button variant="outlined" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={isDisabled}
            >
              {mode === 'draft' ? 'Create Service Log' : 'Save Changes'}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
}
