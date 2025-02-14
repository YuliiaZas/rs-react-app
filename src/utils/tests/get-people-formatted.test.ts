import { describe, expect, it } from 'vitest';
import { mockItems } from '@mock';
import { getPeopleFormatted } from '../get-people-formatted';

describe('getPeopleFormatted', () => {
  it('should format people data correctly for a short list', () => {
    const result = getPeopleFormatted(mockItems[0]);
    expect(result).toEqual({
      id: 1,
      name: 'Luke Skywalker',
      details: [
        { key: 'Gender', value: 'male' },
        { key: 'Year of birth', value: '19BBY' },
        { key: 'Height', value: '172' },
        { key: 'Mass', value: '77' },
      ],
    });
  });

  it('should format people data correctly for a full list', () => {
    const result = getPeopleFormatted(mockItems[0], true);
    expect(result).toEqual({
      id: 1,
      name: 'Luke Skywalker',
      details: [
        { key: 'Gender', value: 'male' },
        { key: 'Year of birth', value: '19BBY' },
        { key: 'Height', value: '172' },
        { key: 'Mass', value: '77' },
        { key: 'Eye color', value: 'blue' },
        { key: 'Hair color', value: 'blond' },
        { key: 'Skin color', value: 'fair' },
      ],
    });
  });
});
