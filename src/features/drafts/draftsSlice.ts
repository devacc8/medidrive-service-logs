import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { DraftSaveStatus, ServiceType, type Draft, type ServiceLogFormValues } from '@/common/types';
import { today, tomorrow } from '@/common/utils/dateUtils';

interface DraftsState {
  items: Record<string, Draft>;
  activeDraftId: string | null;
}

const initialState: DraftsState = {
  items: {},
  activeDraftId: null,
};

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

const draftsSlice = createSlice({
  name: 'drafts',
  initialState,
  reducers: {
    createDraft(state) {
      const id = uuidv4();
      const now = new Date().toISOString();
      state.items[id] = {
        id,
        formValues: defaultFormValues(),
        saveStatus: DraftSaveStatus.Idle,
        createdAt: now,
        updatedAt: now,
      };
      state.activeDraftId = id;
    },

    setActiveDraft(state, action: PayloadAction<string>) {
      if (state.items[action.payload]) {
        state.activeDraftId = action.payload;
      }
    },

    updateDraftFormValues(
      state,
      action: PayloadAction<{ draftId: string; formValues: ServiceLogFormValues }>,
    ) {
      const draft = state.items[action.payload.draftId];
      if (draft) {
        draft.formValues = action.payload.formValues;
        draft.updatedAt = new Date().toISOString();
      }
    },

    setDraftSaveStatus(
      state,
      action: PayloadAction<{ draftId: string; status: DraftSaveStatus }>,
    ) {
      const draft = state.items[action.payload.draftId];
      if (draft) {
        draft.saveStatus = action.payload.status;
      }
    },

    deleteDraft(state, action: PayloadAction<string>) {
      delete state.items[action.payload];
      if (state.activeDraftId === action.payload) {
        const remaining = Object.keys(state.items);
        state.activeDraftId = remaining.length > 0 ? remaining[0] : null;
      }
    },

    clearAllDrafts(state) {
      state.items = {};
      state.activeDraftId = null;
    },
  },
});

export const {
  createDraft,
  setActiveDraft,
  updateDraftFormValues,
  setDraftSaveStatus,
  deleteDraft,
  clearAllDrafts,
} = draftsSlice.actions;

export default draftsSlice.reducer;
