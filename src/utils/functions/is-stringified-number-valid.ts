export const isStringifiedNumberValid = (
  id: string | string[] | undefined
): boolean => {
  return typeof id === 'string' && !isNaN(Number(id));
};
