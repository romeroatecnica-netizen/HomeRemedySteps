import {WELLNESS_REMEDIES} from './remediesWellness';
import {HOUSEHOLD_REMEDIES} from './remediesHousehold';
import {RemedyModule} from '../types/remedy';

export const ALL_REMEDIES: RemedyModule[] = [
  ...WELLNESS_REMEDIES,
  ...HOUSEHOLD_REMEDIES,
];
