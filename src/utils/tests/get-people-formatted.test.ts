import { describe, expect, it } from 'vitest';
import { getPeopleFormatted } from '../get-people-formatted';
import { People } from '../people.interface';

describe('getPeopleFormatted', () => {
  const mockPerson: People = {
    name: 'Luke Skywalker',
    height: '172',
    mass: '77',
    hair_color: 'blond',
    skin_color: 'fair',
    eye_color: 'blue',
    birth_year: '19BBY',
    gender: 'male',
    url: 'https://swapi.dev/api/people/1/',
  };

  it('should format people data correctly for a short list', () => {
    const result = getPeopleFormatted(mockPerson);
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
    const result = getPeopleFormatted(mockPerson, true);
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
