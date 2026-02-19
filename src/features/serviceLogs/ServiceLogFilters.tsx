import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { selectSearchQuery, selectFilters } from './serviceLogsSelectors';
import { setSearchQuery, setDateRangeFilter, setTypeFilter, clearFilters } from './serviceLogsSlice';
import { ServiceType } from '@/common/types';

export function ServiceLogFilters() {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector(selectSearchQuery);
  const filters = useAppSelector(selectFilters);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    filters.dateRange.from !== null ||
    filters.dateRange.to !== null ||
    filters.type !== null;

  return (
    <Box sx={{ mb: 2 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="flex-start">
        <TextField
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          placeholder="Search logs..."
          size="small"
          sx={{ minWidth: 220 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          type="date"
          label="From"
          value={filters.dateRange.from ?? ''}
          onChange={(e) =>
            dispatch(
              setDateRangeFilter({
                from: e.target.value || null,
                to: filters.dateRange.to,
              }),
            )
          }
          size="small"
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: 150 }}
        />

        <TextField
          type="date"
          label="To"
          value={filters.dateRange.to ?? ''}
          onChange={(e) =>
            dispatch(
              setDateRangeFilter({
                from: filters.dateRange.from,
                to: e.target.value || null,
              }),
            )
          }
          size="small"
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: 150 }}
        />

        <TextField
          select
          label="Type"
          value={filters.type ?? ''}
          onChange={(e) =>
            dispatch(setTypeFilter((e.target.value as ServiceType) || null))
          }
          size="small"
          sx={{ minWidth: 140 }}
        >
          <MenuItem value="">All Types</MenuItem>
          <MenuItem value={ServiceType.Planned}>Planned</MenuItem>
          <MenuItem value={ServiceType.Unplanned}>Unplanned</MenuItem>
          <MenuItem value={ServiceType.Emergency}>Emergency</MenuItem>
        </TextField>

        {hasActiveFilters && (
          <Button
            size="small"
            startIcon={<FilterListOffIcon />}
            onClick={() => dispatch(clearFilters())}
          >
            Clear
          </Button>
        )}
      </Stack>
    </Box>
  );
}
