import * as yup from 'yup';
import { ServiceType } from '@/common/types';

export const serviceLogSchema = yup.object({
  providerId: yup.string().required('Provider ID is required').trim(),
  serviceOrder: yup.string().required('Service order is required').trim(),
  carId: yup.string().required('Car ID is required').trim(),
  odometer: yup
    .number()
    .typeError('Odometer must be a number')
    .required('Odometer is required')
    .min(0, 'Odometer cannot be negative')
    .integer('Odometer must be a whole number'),
  engineHours: yup
    .number()
    .typeError('Engine hours must be a number')
    .required('Engine hours is required')
    .min(0, 'Engine hours cannot be negative'),
  startDate: yup.string().required('Start date is required'),
  endDate: yup
    .string()
    .required('End date is required')
    .test('after-start', 'End date must be after start date', function (value) {
      const { startDate } = this.parent as { startDate: string };
      if (!startDate || !value) return true;
      return value > startDate;
    }),
  type: yup
    .mixed<ServiceType>()
    .oneOf(Object.values(ServiceType), 'Invalid service type')
    .required('Service type is required'),
  serviceDescription: yup
    .string()
    .required('Description is required')
    .trim()
    .min(10, 'Description must be at least 10 characters'),
});
