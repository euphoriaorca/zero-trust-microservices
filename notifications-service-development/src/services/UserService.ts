// import { plainToClass } from 'class-transformer';
import { Request } from '../helpers/Request';
import { Logger, CustomError } from '../helpers';
import { ErrorCode } from '../constants';

export const UserService = {
  /**
   * Get user from userdata service
   *
   * @param userId
   */
  async getUserById(userId: string): Promise<any> {
    let response;

    try {
      response = await Request.getWithServiceToken(`${process.env.USER_SERVICE_URL}/users/${userId}/lookup`);
    } catch (err) {
      if (err.code === 404) {
        Logger.Error(`User by Id: ${userId}, could not be found.`, err.message, err.stack);
        throw new CustomError(ErrorCode.RESOURCE_NOT_FOUND, 'User by that Id not found.');
      }

      Logger.Error(`Error occurred while getting user: ${userId}`, err.message, err.stack);
      throw new CustomError(ErrorCode.SERVICE_UNAVAILABLE, 'Error occurred while getting user.');
    }

    // return plainToClass(UserDto, response);
    return response;
  },
  /**
   * Get a user by their email address
   *
   * @param email
   */
  async getUserByEmail(email: string): Promise<any> {
    let response;

    try {
      response = await Request.getWithServiceToken(`${process.env.USER_SERVICE_URL}/users/lookup?email=${email}`);
    } catch (err) {
      if (err.code === 404) {
        Logger.Error(`User by email: ${email}, could not be found.`, err.message, err.stack);
        throw new CustomError(ErrorCode.RESOURCE_NOT_FOUND, 'User by that email not found.');
      }

      Logger.Error(`Error occurred while getting user: ${email}.`, err.message, err.stack);
      throw new CustomError(ErrorCode.SERVICE_UNAVAILABLE, 'Error occurred while getting user.');
    }

    // return plainToClass(UserDto, response);
    return response;
  },
};
