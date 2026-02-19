import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';

const selectDraftsState = (state: RootState) => state.drafts;

export const selectDraftsList = createSelector(
  [selectDraftsState],
  (drafts) =>
    Object.values(drafts.items).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    ),
);

export const selectActiveDraftId = (state: RootState) => state.drafts.activeDraftId;

export const selectActiveDraft = createSelector(
  [selectDraftsState],
  (drafts) => (drafts.activeDraftId ? drafts.items[drafts.activeDraftId] ?? null : null),
);

export const selectDraftCount = createSelector(
  [selectDraftsState],
  (drafts) => Object.keys(drafts.items).length,
);
