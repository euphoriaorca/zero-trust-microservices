/* istanbul ignore file */
/* Testing ignore due to complexities */

import dns from 'dns';
import { ErrorCode } from '../constants';

/**
 * Gets the up address for a domain
 *
 * @param domain
 */
export const lookupDomainIp = (domain: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    dns.lookup(domain.replace(/(^\w+:|^)\/\//, ''), (err, ip) => {
      if (err) {
        reject({
          code: ErrorCode.BAD_REQUEST,
          message: 'Domain lookup failed',
          data: err.stack,
        });
      }

      if (!ip) {
        reject({
          code: ErrorCode.RESOURCE_NOT_FOUND,
          message: 'Domain not found.',
        });
      }

      resolve(ip);
    });
  });
};
