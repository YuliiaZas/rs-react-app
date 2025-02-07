import { getIdFromUrl } from './get-id-from-url';
import { PeopleFormatted } from './people-formatted.interface';
import { People } from './people.interface';

export function getPeopleFormatted(
  item: People,
  isFullList = false
): PeopleFormatted {
  const id = getIdFromUrl(item.url);
  const name = item.name;

  const details = [
    { key: 'Gender', value: item.gender },
    { key: 'Year of birth', value: item.birth_year },
    { key: 'Height', value: item.height },
    { key: 'Mass', value: item.mass },
  ];
  if (!isFullList) return { id, name, details };

  return {
    id,
    name,
    details: [
      ...details,
      { key: 'Eye color', value: item.eye_color },
      { key: 'Hair color', value: item.hair_color },
      { key: 'Skin color', value: item.skin_color },
    ],
  };
}
