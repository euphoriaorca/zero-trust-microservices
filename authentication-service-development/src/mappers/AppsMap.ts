import { Applications } from '../models';
import { IAppDto } from '../interfaces';
import { permsToArray } from '../helpers';

export class AppsMap {
  /**
   * Map application object to IApplication Dto
   *
   * @param app
   */
  public static mapToAppDto(app: Applications): IAppDto {
    /* eslint-disable-next-line */
    const { password, permissions, createdBy, ...mapped } = app;

    return {
      ...mapped,
      permissions: permsToArray(permissions),
    };
  }
}
