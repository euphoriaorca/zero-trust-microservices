import { RoleTypes, TokenTypes } from './interfaces';
import { assignRole, checkPermissions, filterPermsByRole } from './helpers';

const requiredPermissions = ['svcs.test1'];
const permissionsType1 = ['svcs.test1', 'svcs.test2', 'users.test1'];
const permissionsType2 = ['svcs.test3', 'svcs.test4'];

describe('AuthSecurity test suite', function() {
  describe('Permissions filter', function() {
    it('Should filter permissions by role type SERVICE', function() {
      const filtered = filterPermsByRole(RoleTypes.ROLE_SERVICE, permissionsType1);

      expect(filtered).toEqual(['svcs.test1', 'svcs.test2']);
    });

    it('Should filter permissions by role type USER', function() {
      const filtered = filterPermsByRole(RoleTypes.ROLE_USER, permissionsType1);

      expect(filtered).toEqual(['users.test1']);
    });
  });

  describe('Role assignment', function() {
    it('Should assign role ROLE_APP to token type APP', function() {
      expect(assignRole(TokenTypes.APP)).toEqual(RoleTypes.ROLE_APP);
    });

    it('Should assign role ROLE_USER to token type USER', function() {
      expect(assignRole(TokenTypes.USER)).toEqual(RoleTypes.ROLE_USER);
    });

    it('Should assign role ROLE_SERVICE to token type SERVICE', function() {
      expect(assignRole(TokenTypes.SERVICE)).toEqual(RoleTypes.ROLE_SERVICE);
    });
  });

  describe('Permissions exists check', function() {
    it('Expected to return false. Required permission(s) not found', function() {
      expect(checkPermissions(requiredPermissions, permissionsType2)).toBe(false);
    });

    it('Should return true. Required permission(s) found', function() {
      expect(checkPermissions(requiredPermissions, permissionsType1)).toBe(true);
    });
  });
});
