import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { selectSearchQuery, selectFilters } from './serviceLogsSelectors';
import { setSearchQuery, setDateRangeFilter, setTypeFilter, clearFilters } from './serviceLogsSlice';
import { ServiceType } from '@/common/types';

const SERVICE_TYPE_VALUES = new Set<string>(Object.values(ServiceType));

function isServiceType(value: string): value is ServiceType {
  return SERVICE_TYPE_VALUES.has(value);
}

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
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'flex-start' }}>
        <TextField
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          placeholder="Search..."
          size="small"
          sx={{ flex: '1 1 140px', minWidth: 140, maxWidth: 200 }}
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
          sx={{ flex: '0 1 145px', minWidth: 130 }}
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
          sx={{ flex: '0 1 145px', minWidth: 130 }}
        />

        <TextField
          select
          label="Type"
          value={filters.type ?? ''}
          onChange={(e) => {
            const val = e.target.value;
            dispatch(setTypeFilter(isServiceType(val) ? val : null));
          }}
          size="small"
          sx={{ flex: '0 0 120px' }}
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
      </Box>
    </Box>
  );
}
