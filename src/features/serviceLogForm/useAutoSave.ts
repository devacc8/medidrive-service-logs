import { useEffect, useRef, useCallback } from 'react';
import { useWatch, type Control } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { updateDraftFormValues, setDraftSaveStatus } from '@/features/drafts/draftsSlice';
import { DraftSaveStatus, type ServiceLogFormValues } from '@/common/types';

const DEBOUNCE_MS = 500;

export function useAutoSave(control: Control<ServiceLogFormValues>, enabled: boolean) {
  const dispatch = useAppDispatch();
  const activeDraftId = useAppSelector((s) => s.drafts.activeDraftId);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const watchedValues = useWatch({ control });

  const save = useCallback(
    (values: ServiceLogFormValues) => {
      if (!activeDraftId) return;
      dispatch(updateDraftFormValues({ draftId: activeDraftId, formValues: values }));
      dispatch(setDraftSaveStatus({ draftId: activeDraftId, status: DraftSaveStatus.Saved }));
    },
    [activeDraftId, dispatch],
  );

  useEffect(() => {
    if (!enabled || !activeDraftId) return;

    dispatch(setDraftSaveStatus({ draftId: activeDraftId, status: DraftSaveStatus.Saving }));

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      save(watchedValues as ServiceLogFormValues);
    }, DEBOUNCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [watchedValues, activeDraftId, dispatch, save, enabled]);
}
