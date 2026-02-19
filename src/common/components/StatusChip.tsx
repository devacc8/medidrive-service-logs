import Chip from '@mui/material/Chip';
import { ServiceType } from '@/common/types';

const TYPE_CONFIG: Record<ServiceType, { label: string; color: 'success' | 'warning' | 'error' }> = {
  [ServiceType.Planned]: { label: 'Planned', color: 'success' },
  [ServiceType.Unplanned]: { label: 'Unplanned', color: 'warning' },
  [ServiceType.Emergency]: { label: 'Emergency', color: 'error' },
};

interface StatusChipProps {
  type: ServiceType;
}

export function StatusChip({ type }: StatusChipProps) {
  const config = TYPE_CONFIG[type];
  return <Chip label={config.label} color={config.color} size="small" variant="outlined" />;
}
