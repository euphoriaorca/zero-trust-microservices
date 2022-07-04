/**
 * Convert permissions string to an array of permissions
 *
 * @param permissionsStr
 */
export const permsToArray = (permissionsStr: string): string[] => {
  return (permissionsStr || '')
    .trim()
    .split(',')
    .map(perm => perm.trim())
    .filter(Boolean);
};

/**
 * Convert permissions array to string
 *
 * @param permissionsArr
 */
export const permsToString = (permissionsArr: string[]): string => {
  return permissionsArr
    .map(perm => perm.trim())
    .filter(Boolean)
    .join(',');
};
