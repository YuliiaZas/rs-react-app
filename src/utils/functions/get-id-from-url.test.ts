import { describe, expect, it } from 'vitest';
import { getIdFromUrl } from './get-id-from-url';

describe('getIdFromUrl', () => {
  it('should return the correct id from a valid URL', () => {
    const url = 'https://swapi.dev/api/people/1/';
    const result = getIdFromUrl(url);
    expect(result).toBe('1');
  });

  it('should return the correct id from a valid URL with "details" segment', () => {
    const url = 'https://swapi.dev/api/people/1/details';
    const result = getIdFromUrl(url);
    expect(result).toBe('1');
  });

  it('should return the correct id from a valid URL without "/" in the end', () => {
    const url = 'https://swapi.dev/api/people/1';
    const result = getIdFromUrl(url);
    expect(result).toBe('1');
  });

  it('should return the correct id from a valid URL with search params', () => {
    const url = 'https://swapi.dev/api/people/1?page=2';
    const result = getIdFromUrl(url);
    expect(result).toBe('1');
  });

  it('should return the correct id from a valid URL with search params without value', () => {
    const url = 'https://swapi.dev/api/people/1?page=';
    const result = getIdFromUrl(url);
    expect(result).toBe('1');
  });

  it('should return the correct id from a valid URL with "details" segment and search params', () => {
    const url = 'https://swapi.dev/api/people/1/details?page=2';
    const result = getIdFromUrl(url);
    expect(result).toBe('1');
  });

  it('should return empty string for a URL without id', () => {
    const url = 'https://swapi.dev/api/people/1abc/';
    const result = getIdFromUrl(url);
    expect(result).toBe('');
  });

  it('should return empty string for a URL without id with search params', () => {
    const url = 'https://swapi.dev/api/people/1abc?page=2';
    const result = getIdFromUrl(url);
    expect(result).toBe('');
  });
});
