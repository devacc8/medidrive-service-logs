import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import type { ServiceLog, ServiceLogFormValues } from '@/common/types';
import { ServiceType } from '@/common/types';

interface ServiceLogsState {
  items: ServiceLog[];
  searchQuery: string;
  filters: {
    dateRange: { from: string | null; to: string | null };
    type: ServiceType | null;
  };
}

const initialState: ServiceLogsState = {
  items: [],
  searchQuery: '',
  filters: {
    dateRange: { from: null, to: null },
    type: null,
  },
};

const serviceLogsSlice = createSlice({
  name: 'serviceLogs',
  initialState,
  reducers: {
    createServiceLog(state, action: PayloadAction<ServiceLogFormValues>) {
      const now = new Date().toISOString();
      const values = action.payload;
      state.items.push({
        id: uuidv4(),
        providerId: values.providerId,
        serviceOrder: values.serviceOrder,
        carId: values.carId,
        odometer: Number(values.odometer),
        engineHours: Number(values.engineHours),
        startDate: values.startDate,
        endDate: values.endDate,
        type: values.type,
        serviceDescription: values.serviceDescription,
        createdAt: now,
        updatedAt: now,
      });
    },

    updateServiceLog(
      state,
      action: PayloadAction<{ id: string; values: ServiceLogFormValues }>,
    ) {
      const idx = state.items.findIndex((log) => log.id === action.payload.id);
      if (idx !== -1) {
        const values = action.payload.values;
        state.items[idx] = {
          ...state.items[idx],
          providerId: values.providerId,
          serviceOrder: values.serviceOrder,
          carId: values.carId,
          odometer: Number(values.odometer),
          engineHours: Number(values.engineHours),
          startDate: values.startDate,
          endDate: values.endDate,
          type: values.type,
          serviceDescription: values.serviceDescription,
          updatedAt: new Date().toISOString(),
        };
      }
    },

    deleteServiceLog(state, action: PayloadAction<string>) {
      state.items = state.items.filter((log) => log.id !== action.payload);
    },

    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },

    setDateRangeFilter(
      state,
      action: PayloadAction<{ from: string | null; to: string | null }>,
    ) {
      state.filters.dateRange = action.payload;
    },

    setTypeFilter(state, action: PayloadAction<ServiceType | null>) {
      state.filters.type = action.payload;
    },

    clearFilters(state) {
      state.searchQuery = '';
      state.filters = { dateRange: { from: null, to: null }, type: null };
    },
  },
});

export const {
  createServiceLog,
  updateServiceLog,
  deleteServiceLog,
  setSearchQuery,
  setDateRangeFilter,
  setTypeFilter,
  clearFilters,
} = serviceLogsSlice.actions;

export default serviceLogsSlice.reducer;
