import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';

const selectServiceLogsState = (state: RootState) => state.serviceLogs;

export const selectFilteredServiceLogs = createSelector(
  [selectServiceLogsState],
  (state) => {
    let filtered = state.items;

    if (state.searchQuery.trim()) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter((log) =>
        [log.providerId, log.serviceOrder, log.carId, log.serviceDescription, log.type].some(
          (field) => field.toLowerCase().includes(query),
        ),
      );
    }

    const { from, to } = state.filters.dateRange;
    if (from) {
      filtered = filtered.filter((log) => log.startDate >= from);
    }
    if (to) {
      filtered = filtered.filter((log) => log.startDate <= to);
    }

    if (state.filters.type) {
      filtered = filtered.filter((log) => log.type === state.filters.type);
    }

    return filtered;
  },
);

export const selectServiceLogCount = (state: RootState) =>
  state.serviceLogs.items.length;

export const selectSearchQuery = (state: RootState) =>
  state.serviceLogs.searchQuery;

export const selectFilters = (state: RootState) =>
  state.serviceLogs.filters;
