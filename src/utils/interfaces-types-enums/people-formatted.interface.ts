import { KeyValuePair } from './key-value-pair.type';

export interface PeopleFormatted {
  id: string;
  name: string;
  details: KeyValuePair[];
}
