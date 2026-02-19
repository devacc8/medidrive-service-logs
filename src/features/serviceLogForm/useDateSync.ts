import { useEffect } from 'react';
import { useWatch, type UseFormSetValue, type Control } from 'react-hook-form';
import { addDays } from '@/common/utils/dateUtils';
import type { ServiceLogFormValues } from '@/common/types';

export function useDateSync(
  control: Control<ServiceLogFormValues>,
  setValue: UseFormSetValue<ServiceLogFormValues>,
) {
  const startDate = useWatch({ control, name: 'startDate' });

  useEffect(() => {
    if (startDate) {
      const nextDay = addDays(startDate, 1);
      setValue('endDate', nextDay, { shouldValidate: true, shouldDirty: true });
    }
  }, [startDate, setValue]);
}
