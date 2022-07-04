import { plainToClass } from 'class-transformer';
import { ClassType, TransformClassType } from './interfaces';

/**
 * Transform an object from a class
 *
 * @param data
 * @param transformFromClass
 */
export const IfTransformFromClass = <T>(data: any, transformFromClass?: ClassType<T>): TransformClassType<T> => {
  return plainToClass(transformFromClass!, data);
};
