export const ServiceType = {
  Planned: 'planned',
  Unplanned: 'unplanned',
  Emergency: 'emergency',
} as const;

export type ServiceType = (typeof ServiceType)[keyof typeof ServiceType];

export const DraftSaveStatus = {
  Idle: 'idle',
  Saving: 'saving',
  Saved: 'saved',
} as const;

export type DraftSaveStatus = (typeof DraftSaveStatus)[keyof typeof DraftSaveStatus];

export interface ServiceLogFormValues {
  providerId: string;
  serviceOrder: string;
  carId: string;
  odometer: number | '';
  engineHours: number | '';
  startDate: string;
  endDate: string;
  type: ServiceType;
  serviceDescription: string;
}

export interface Draft {
  id: string;
  formValues: ServiceLogFormValues;
  saveStatus: DraftSaveStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceLog {
  id: string;
  providerId: string;
  serviceOrder: string;
  carId: string;
  odometer: number;
  engineHours: number;
  startDate: string;
  endDate: string;
  type: ServiceType;
  serviceDescription: string;
  createdAt: string;
  updatedAt: string;
}
