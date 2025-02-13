import { KeyValuePair } from './key-value-pair.type';

export interface PeopleFormatted {
  id: number | null;
  name: string;
  details: KeyValuePair[];
}
