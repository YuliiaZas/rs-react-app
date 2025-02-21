import { People, PeopleFormatted, SearchResultFormatted } from '@utils';

export const mockSearchValue = 'Luke';

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
export const mockItemsFormatted: PeopleFormatted[] = [
  {
    id: mockItemsIds[0],
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
  },
  {
    id: mockItemsIds[1],
    name: 'C-3PO',
    details: [
      { key: 'Gender', value: 'n/a' },
      { key: 'Year of birth', value: '112BBY' },
      { key: 'Height', value: '167' },
      { key: 'Mass', value: '75' },
      { key: 'Eye color', value: 'yellow' },
      { key: 'Hair color', value: 'n/a' },
      { key: 'Skin color', value: 'gold' },
    ],
  },
];

export const mockFetchItemsResult: SearchResultFormatted<
  People,
  PeopleFormatted
> = {
  count: 5,
  next: 'url/1',
  previous: 'url/3',
  results: [...mockItems],
  itemsFormatted: [...mockItemsFormatted],
};

export const mockErrorComponentText = 'Mocked Error Component';
