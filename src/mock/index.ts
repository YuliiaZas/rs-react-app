import { People } from '@utils';

export const mockItemsIds = ['1', '2'];

export const mockItems: People[] = [
  {
    name: 'Luke Skywalker',
    height: '172',
    mass: '77',
    hair_color: 'blond',
    skin_color: 'fair',
    eye_color: 'blue',
    birth_year: '19BBY',
    url: `https://swapi.dev/api/people/${mockItemsIds[0]}`,
    gender: 'male',
  },
  {
    name: 'C-3PO',
    height: '167',
    mass: '75',
    hair_color: 'n/a',
    skin_color: 'gold',
    eye_color: 'yellow',
    birth_year: '112BBY',
    url: `https://swapi.dev/api/people/${mockItemsIds[1]}`,
    gender: 'n/a',
  },
];

export const mockErrorComponentText = 'Mocked Error Component';
