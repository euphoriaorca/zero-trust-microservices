import { Services } from '../models';
import { IServiceDto } from '../interfaces';
import { permsToArray } from '../helpers';

export class ServicesMap {
  /**
   * Map service object to IServiceDto
   *
   * @param service
   */
  public static mapToServiceDto(service: Services): IServiceDto {
    /* eslint-disable-next-line */
    const { password, permissions, createdBy, ...mapped } = service;

    return {
      ...mapped,
      permissions: permsToArray(permissions),
    };
  }
}
