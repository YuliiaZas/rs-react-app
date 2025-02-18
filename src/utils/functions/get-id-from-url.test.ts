import { describe, expect, it } from 'vitest';
import { getIdFromUrl } from './get-id-from-url';

describe('getIdFromUrl', () => {
  it('should return the correct id from a valid URL', () => {
    const url = 'https://swapi.dev/api/people/1/';
    const result = getIdFromUrl(url);
    expect(result).toBe('1');
  });

  it('should return the correct id from a valid URL without "/" in the end', () => {
    const url = 'https://swapi.dev/api/people/1';
    const result = getIdFromUrl(url);
    expect(result).toBe('1');
  });

  it('should return URL for a URL without id', () => {
    const url = 'https://swapi.dev/api/people/abc/';
    const result = getIdFromUrl(url);
    expect(result).toBe(url);
  });
});
