import faker from 'faker';

import { AppsMap } from '../../mappers/AppsMap';
import { AppTypes } from '../../interfaces';

describe('App mappers tests', () => {
  it('Maps to app IAppDto', () => {
    const appId = faker.random.uuid();
    const appType = AppTypes.BROWSER;
    const description = 'Hello world!';
    const permissions = 'perm1, perm2,';
    const domain = 'https://example.com';
    const ip = '1.0.0.0';
    const createdAt = '2020-02-10 12:35:50.058000';
    const updatedAt = '2020-02-10 12:35:50.058000';

    expect(
      AppsMap.mapToAppDto(<any>{
        appId,
        appType,
        description,
        permissions,
        domain,
        ip,
        createdAt,
        updatedAt,
      }),
    ).toEqual({
      appId,
      appType,
      description,
      permissions: ['perm1', 'perm2'],
      domain,
      ip,
      createdAt,
      updatedAt,
    });
  });
});
